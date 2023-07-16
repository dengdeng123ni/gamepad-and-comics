import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { compressAccurately } from 'image-conversion';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom, forkJoin, Subject } from 'rxjs';
interface Comics {
  id: number;
  createTime: number;
  cover: {
    id: number;
    src: string;
  };
  chapter: {
    id: number;
    index: number;
    title: string;
    total: number;
  };
  title: string;
  origin: string;
  mode: number;
  chapters: Array<Chapters>,
  isFirstPageCover: boolean;
  pageOrder: boolean;
}
interface Chapters {
  id: number;
  date: number;
  images: Array<{
    id: number;
    src: string;
    small?: string;
    height?: number;
    width?: number;
    thumbnail?: string
  }>
  lastReadTime:number,
  title: string
}
@Injectable({
  providedIn: 'root'
})
export class CurrentDetailService {
  comics: Comics = null;
  is_destroy = false;
  constructor(
    private db: NgxIndexedDBService,
    public http: HttpClient,
    public router: Router
  ) {

    this.onThumbnailItemClick$.subscribe(x => {
      const { event$, data } = x;
      this.router_reader_page(data, data.index);
    })
  }

  public edit$ = new Subject<boolean>();

  public onDownloadClick$ = new Subject<{ $event: PointerEvent, data: any }>();
  public onThumbnailItemClick$ = new Subject<{ event$: PointerEvent, data: any }>();

  public afterInit$ = new Subject<Comics>();

  public afterInit() {
    return this.afterInit$
  }

  public onDownloadClick() {
    return this.onDownloadClick$
  }

  public edit() {
    return this.edit$
  }

  async init(id) {
    id = parseInt(id);
    this.is_destroy = true;
    setTimeout(() => { this.createSmailImage(id) }, 1000)
    const x:any = await firstValueFrom(forkJoin([this.db.getByKey('comics', id), this.db.getByKey('state', id)]));
    const comics = { ...x[0], ...x[1] };
    comics.chapters.forEach(c => {
      c.images.forEach((j, i) => {
        if (!c.images[i].small) c.images[i].small = c.images[i].src;
        if (!c.images[i].width) c.images[i].width = 0;
        if (!c.images[i].height) c.images[i].height = 0;
      })
    })
    this.comics = comics;
    this.getChapterLastReadingDate();
  }
  update_state(chapter, index) {
    if (Number.isNaN(index)) index = 0;
    const state = {
      chapter:
        { id: chapter.id, index: chapter.index, title: chapter.title, total: chapter.total },
      lastReadTime: new Date().getTime(), id: this.comics.id,
      mode: this.comics.mode, isFirstPageCover: this.comics.isFirstPageCover, pageOrder: this.comics.pageOrder
    };
    this.db.update('state', state).subscribe()
  }
  router_reader_page(chapter, index?) {

    if (index) {
      const state = {
        chapter: {
          id: chapter.id,
          index: index,
          title: chapter.title,
          total: chapter.images.length
        },
        lastReadTime: new Date().getTime(),
        id: this.comics.id,
        mode: this.comics.mode,
        isFirstPageCover: this.comics.isFirstPageCover,
        pageOrder: this.comics.pageOrder
      }
      this.db.update('state', state).subscribe(() => this.router.navigate(['/reader', this.comics.id]))
    } else {
      let state = {
        chapter: {
          id: chapter.id,
          index: index,
          title: chapter.title,
          total: chapter.images.length
        },
        lastReadTime: new Date().getTime(),
        id: this.comics.id,
        mode: this.comics.mode,
        isFirstPageCover: this.comics.isFirstPageCover,
        pageOrder: this.comics.pageOrder
      }
      this.db.update('state', state).subscribe(() => this.router.navigate(['/reader', this.comics.id]))
      this.db.getByID('chapter_state', chapter.id).subscribe((x: any) => {
        if (x) {
          state.chapter.index = x.index;
          this.db.update('state', state).subscribe(() => this.router.navigate(['/reader', this.comics.id]))
        } else {
          state.chapter.index = 0;
          this.db.update('state', state).subscribe(() => this.router.navigate(['/reader', this.comics.id]))
        }
      })
    }
  }
  chapterPageChange(chapterId: number, index: number) {
    const chapter = this.comics.chapters.find(x => x.id == chapterId);
    this.router_reader_page(chapter, index)
  }
  async deleteChapter(chapterIds: Array<number>) {
    const update_state = (chapter) => {
      let state = {
        chapter: {
          id: chapter.id,
          index: 0,
          title: chapter.title,
          total: chapter.images.length
        },
        lastReadTime: new Date().getTime(),
        id: this.comics.id,
        mode: this.comics.mode,
        isFirstPageCover: this.comics.isFirstPageCover,
        pageOrder: this.comics.pageOrder
      }
      this.db.getByID('chapter_state', chapter.id).subscribe((x: any) => {
        if (x) {
          state.chapter.index = x.index;
          this.db.update('state', state).subscribe()
        } else {
          state.chapter.index = 0;
          this.db.update('state', state).subscribe()
        }
      })
    }
    let chapterCurrentId = this.comics.chapter.id;
    let imageIds = [];
    const cache = await caches.open('image');
    const detaleCacheImage = async (ids) => {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const res = await cache.delete(`${window.location.origin}/image/${id}`)
        const res2 = await cache.delete(`${window.location.origin}/image/small/${id}`)
      }
    }
    const detaleCacheChapter = async (ids) => {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const res = await cache.delete(`${window.location.origin}/chapter_thumbnail/${id}`)
      }
    }
    const id = this.comics.id;
    const comics: any = await firstValueFrom(this.db.getByKey('comics', id))
    const chapterIdDeletes = comics.chapters.filter(x => chapterIds.includes(x.id))
    chapterIdDeletes.forEach(x => x.images.forEach(c => imageIds.push(c.id)));
    comics.chapters = comics.chapters.filter(x => !chapterIds.includes(x.id))
    this.comics.chapters = this.comics.chapters.filter(x => !chapterIds.includes(x.id))
    if (comics.chapters[0]) update_state(comics.chapters[0])
    detaleCacheImage(imageIds);
    detaleCacheChapter(chapterIds);
    await firstValueFrom(this.db.update('comics', comics))
    this.init(comics.id);
    // this.comics.id;

  }


  close() {
    this.is_destroy = false;
  }

  async insertPage(comicsId: number, chaptersId: number, imageId: number, imageData = "", direction = "before") {
    const loadImage = async (imageUrl) => {
      return await createImageBitmap(await fetch(imageUrl).then((r) => r.blob()))
    }
    const getImageBase64 = async (src) => {
      const image1 = await loadImage(src);
      let canvas = document.createElement('canvas');
      canvas.width = image1.width;
      canvas.height = image1.height;
      let context = canvas.getContext('2d');
      context.drawImage(image1, 0, 0, image1.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 255;
        imageData.data[i + 3] = 255;
      }
      context.putImageData(imageData, 0, 0);
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#fff';
      let dataURL = canvas.toDataURL("image/png", 0.1);
      return dataURL
    }
    const base64ToBlob = (data) => {
      var parts = data.split(';base64,'),
        contentType = parts[0].split(':')[1],
        raw = window.atob(parts[1]),
        length = raw.length,
        arr = new Uint8Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = raw.charCodeAt(i);
      }
      var blob = new Blob([arr], { type: contentType });
      return blob
    };
    const uploadImage = async (src): Promise<{ id: number, width: number, height: number, src: string, small: string }> => {
      const dataURL = await getImageBase64(src)
      const image = await loadImage(dataURL)
      const blob = base64ToBlob(dataURL);
      const formData = new FormData();
      formData.append('file', blob);
      const id = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { id: new Date().getTime(), width: image.width, height: image.height, src: `http://localhost:7899/image/${id}`, small: `http://localhost:7899/image/${id}` }
    }
    const uploadImageData = async (dataURL): Promise<{ id: number, width: number, height: number, src: string, small: string }> => {
      const image = await loadImage(dataURL)
      const blob = base64ToBlob(dataURL);
      const formData = new FormData();
      formData.append('file', blob);
      const id = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { id: new Date().getTime(), width: image.width, height: image.height, src: `http://localhost:7899/image/${id}`, small: `http://localhost:7899/image/${id}` }
    }
    // const uploadImage = async (href): Promise<{  id: number,width:number,height:number, src: string, small: string }> => {
    //   const dataURL = await getImageBase64(href)
    //   const image= await loadImage(dataURL)
    //   const blob = base64ToBlob(dataURL);
    //   const id = new Date().getTime();
    //   const src = URL.createObjectURL(blob);
    //   const imageSrc = `${window.location.origin}/image/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { id: id, src: imageSrc,small:imageSrc,width:image.width,height:image.height, }
    // }

    // const uploadImageData = async (dataURL): Promise<{  id: number,width:number,height:number, src: string, small: string }> => {
    //   const image= await loadImage(dataURL)
    //   const blob = base64ToBlob(dataURL);
    //   const id = new Date().getTime();
    //   const src = URL.createObjectURL(blob);
    //   const imageSrc = `${window.location.origin}/image/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { id: id, src: imageSrc,small:imageSrc,width:image.width,height:image.height, }
    // }

    const update = async (comics) => {
      await firstValueFrom(this.db.update('comics', comics))
    }

    const updatePageData = async () => {
      let obj = null;
      const index = this.comics.chapters.findIndex(c => c.id == chaptersId);
      const imageIndex = this.comics.chapters[index].images.findIndex(c => c.id == imageId);
      const src = this.comics.chapters[index].images[imageIndex].src;
      if (src) {
        if (imageData) {
          obj = await uploadImageData(imageData)
        } else {
          obj = await uploadImage(src)
        }
        if (direction == "before") this.comics.chapters[index].images.splice(imageIndex, 0, obj);
        else this.comics.chapters[index].images.splice(imageIndex + 1, 0, obj);
      }
      return { id: obj.id, src: obj.src }
    }

    const obj = await updatePageData();
    const x: any = await firstValueFrom(this.db.getByKey('comics', comicsId))
    const index = x.chapters.findIndex(c => c.id == chaptersId);
    const imageIndex = x.chapters[index].images.findIndex(c => c.id == imageId);
    const src = x.chapters[index].images[imageIndex].src;
    if (src) {
      if (direction == "before") x.chapters[index].images.splice(imageIndex, 0, obj);
      else x.chapters[index].images.splice(imageIndex + 1, 0, obj);
    }
    await update(x)
  }
  async deletePage(comicsId: number, chaptersId: number, imageId: number) {
    const updatePageData = () => {
      const index = this.comics.chapters.findIndex(c => c.id == chaptersId);
      const imageIndex = this.comics.chapters[index].images.findIndex(c => c.id == imageId);
      this.comics.chapters[index].images.splice(imageIndex, 1);
    }
    const update = async (comics) => {
      await firstValueFrom(this.db.update('comics', comics))
    }
    const detaleCacheImage = async (ids) => {
      const cache = await caches.open('image');
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const res = await cache.delete(`${window.location.origin}/image/${id}`)
        const res2 = await cache.delete(`${window.location.origin}/image/small/${id}`)
      }
    }
    updatePageData();
    const x: any = await firstValueFrom(this.db.getByKey('comics', comicsId))
    const index = x.chapters.findIndex(c => c.id == chaptersId);
    const imageIndex = x.chapters[index].images.findIndex(c => c.id == imageId);
    x.chapters[index].images.splice(imageIndex, 1);
    detaleCacheImage([imageId]);
    await update(x)
    if (x.chapters[index].images.length == 0) await this.deleteChapter([x.chapters[index].id])
  }
  async deletePages(comicsId: number, list:Array<{chaptersId: number, imageId: number}>) {
    const updatePageData = (chaptersId,imageId) => {
      const index = this.comics.chapters.findIndex(c => c.id == chaptersId);
      const imageIndex = this.comics.chapters[index].images.findIndex(c => c.id == imageId);
      this.comics.chapters[index].images.splice(imageIndex, 1);
    }
    const update = async (comics) => {
      await firstValueFrom(this.db.update('comics', comics))
    }
    const detaleCacheImage = async (ids) => {
      const cache = await caches.open('image');
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const res = await cache.delete(`${window.location.origin}/image/${id}`)
        const res2 = await cache.delete(`${window.location.origin}/image/small/${id}`)
      }
    }
    const x: any = await firstValueFrom(this.db.getByKey('comics', comicsId))
    let images=[];
    list.forEach(obj=>{
      const {chaptersId, imageId}= obj;
      updatePageData(chaptersId, imageId);
      const index = x.chapters.findIndex(c => c.id == chaptersId);
      const imageIndex = x.chapters[index].images.findIndex(c => c.id == imageId);
      x.chapters[index].images.splice(imageIndex, 1);
      if (x.chapters[index].images.length == 0) this.deleteChapter([x.chapters[index].id])
      images.push(imageId)
    })
    detaleCacheImage(images);
    await update(x)
  }
  async createSmailImage(id) {
    const loadImage = async (imageUrl): Promise<ImageBitmap> =>  await createImageBitmap(await fetch(imageUrl).then((r) => r.blob()))

    // const createSmailImage = async (href, id) => {
    //   const img = await loadImage(href);
    //   const req = await fetch(href);
    //   const blob = await req.blob();
    //   const thumbnailBlob = await compressAccurately(blob, { size: 50, accuracy: 0.9, width: 200, orientation: 1, scale: 0.5, })
    //   const src = URL.createObjectURL(thumbnailBlob);
    //   const imageSrc = `${window.location.origin}/image/small/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { small:imageSrc, width:img.width, height:img.height }
    // }

    // const createSmailImage = async (href, id) => {
    //   const img = await loadImage(href);
    //   const req = await fetch(href);
    //   const blob = await req.blob();
    //   const thumbnailBlob = await compressAccurately(blob, { size: 50, accuracy: 0.9, width: 200, orientation: 1, scale: 0.5, })
    //   const formData = new FormData();
    //   formData.append('file', thumbnailBlob);
    //   const idc = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
    //   return { small: `http://localhost:7899/image/${idc}`, width: img.width, height: img.height }
    // }
    // const comics: any = await firstValueFrom(this.db.getByKey('comics', id))
    // for (let i = 0; i < comics.chapters.length; i++) {
    //   const x = comics.chapters[i].images[0];
    //   if (!x.small && this.is_destroy) {
    //     const res = await createSmailImage(x.src, x.id);

    //     this.comics.chapters[i].images[0].small = res.small;
    //     this.comics.chapters[i].images[0].width = res.width;
    //     this.comics.chapters[i].images[0].height = res.height;

    //     comics.chapters[i].images[0].small = res.small;
    //     comics.chapters[i].images[0].width = res.width;
    //     comics.chapters[i].images[0].height = res.height;
    //     await firstValueFrom(this.db.update('comics', comics))
    //   }
    // }
    // for (let i = 0; i < comics.chapters.length; i++) {
    //   const x = comics.chapters[i];
    //   for (let j = 0; j < x.images.length; j++) {
    //     if (comics.chapters[i].images[j].width || comics.chapters[i].images[j].height) continue
    //     if (!!comics.chapters[i].images[j].small && this.is_destroy) continue
    //     const res = await createSmailImage(comics.chapters[i].images[j].src, comics.chapters[i].images[j].id)

    //     this.comics.chapters[i].images[j].small = res.small;
    //     this.comics.chapters[i].images[j].width = res.width;
    //     this.comics.chapters[i].images[j].height = res.height;

    //     comics.chapters[i].images[j].small = res.small;
    //     comics.chapters[i].images[j].width = res.width;
    //     comics.chapters[i].images[j].height = res.height;
    //     await firstValueFrom(this.db.update('comics', comics))
    //   }
    // }
  }

  async resetReadingProgress(id) {
    const comics: Comics = await firstValueFrom(this.db.getByKey('comics', id))
    for (let index = 0; index < comics.chapters.length; index++) {
      const x = comics.chapters[index];
      if (index == 0 && x) {
        let state: Comics = await firstValueFrom(this.db.getByKey('state', id))
        state.chapter = { id: x.id, title: x.title, index: 0, total: x.images.length };
        await firstValueFrom(this.db.update('state', state))
      }
      await firstValueFrom(this.db.update('chapter_state', { id: x.id, title: x.title, index: 0, total: x.images.length }))
    }
    const c:any=await firstValueFrom(this.db.getAll('image_state'))
    const list = c.filter(x => x.comicsId == id);
    for (let i = 0; i < list.length; i++) {
      const x = c[i];
      await firstValueFrom(this.db.deleteByKey("image_state",x.id))
    }
  }
  getChapterLastReadingDate() {
    this.db.getAll('image_state').subscribe((x: any) => {
      const list = x.filter(x => x.comicsId == this.comics.id);
      const filter_list = duplicates(list)
      const chapterIds = this.comics.chapters.filter(x => x.id);
      this.comics.chapters.forEach(x => {
        const index = filter_list.findIndex(s => x.id == s.chapterId);
        if (index > -1) {
          x.lastReadTime = x.id;
        }
      })
      this.afterInit$.next(this.comics);
    });
    const duplicates = (arr) => {
      //使用Map数据结构，去除数组中id相同的元素，保留date较大的那个
      let map = new Map();
      for (let item of arr) {
        //获取元素的id和date属性
        let id = item.chapterId;
        let date = item.id;
        //如果Map中已经存在该id，比较date的大小，保留较大的那个
        if (map.has(id)) {
          //获取Map中元素的date
          let oldDate = map.get(id).date;
          //如果新元素的date大于旧元素的date，更新Map中的元素
          if (date > oldDate) {
            map.set(id, item);
          }
        } else {
          //如果Map中不存在该id，直接将元素添加到Map中
          map.set(id, item);
        }
      }
      //创建一个空数组，用于存储排序后的结果
      let result = [];
      //遍历Map中的每个键值对
      for (let [key, value] of map) {
        //将键值对的值放入数组中
        result.push(value);
      }
      //按照date从大到小进行排序
      // result.sort((a, b) => b.date - a.date);
      //返回排序后的数组
      return result;
    }
  }
}
