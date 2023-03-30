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
  isFirstPageCover:boolean;
  pageOrder:boolean;
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
  title: string
}
@Injectable({
  providedIn: 'root'
})
export class CurrentDetailService {
  comics: Comics = null;
  isLeave=false;
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
    this.isLeave=true;
    setTimeout(() => { this.createSmailImage(id) }, 1000)

    forkJoin([this.db.getByKey('comics', id), this.db.getByKey('state', id)]).subscribe(async (x: any) => {
      const comics = { ...x[0], ...x[1] };
      comics.chapters.forEach(c => {
        if (!c.images[0].small) c.images[0].small = c.images[0].src;
        if (!c.images[0].width) c.images[0].width = 0;
        if (!c.images[0].height) c.images[0].height = 0;
      })
      this.comics = comics;
      this.afterInit$.next(this.comics);

    })

  }
  update_state(chapter, index) {
    if (Number.isNaN(index)) index = 0;
    const state = { chapter:
       { id: chapter.id, index: chapter.index, title: chapter.title, total: chapter.total },
        lastReadTime: new Date().getTime(), id: this.comics.id,
          mode: this.comics.mode,isFirstPageCover:this.comics.isFirstPageCover,pageOrder:this.comics.pageOrder };
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
        isFirstPageCover:this.comics.isFirstPageCover,
        pageOrder:this.comics.pageOrder
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
        isFirstPageCover:this.comics.isFirstPageCover,
        pageOrder:this.comics.pageOrder
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
  chapterPageChange(chapterId:number,index:number){

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
        isFirstPageCover:this.comics.isFirstPageCover,
        pageOrder:this.comics.pageOrder
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
    this.db.getByKey('comics', id).subscribe((comics: Comics) => {
      const chapterIdDeletes = comics.chapters.filter(x => chapterIds.includes(x.id))
      chapterIdDeletes.forEach(x => x.images.forEach(c => imageIds.push(c.id)));
      comics.chapters = comics.chapters.filter(x => !chapterIds.includes(x.id))
      if (comics.chapters[0]) update_state(comics.chapters[0])
      detaleCacheImage(imageIds);
      detaleCacheChapter(chapterIds);
      this.db.update('comics', comics).subscribe(() => {
        this.init(comics.id);
      })
    })
    // this.comics.id;

  }


  close(){
    this.update_state(this.comics.chapter,this.comics.chapter.index);
    this.isLeave=false;
  }

  async insertPage(comicsId: number, chaptersId: number, imageId: number, imageData = "", direction = "before") {
    const loadImage = (src): Promise<HTMLImageElement> => {
      return new Promise((r, j) => {
        var img = new Image();
        img.setAttribute('crossorigin', 'anonymous');
        img.src = src;
        img.onload = () => r(img)
        img.onerror = () => j({ width: 0, height: 0 });
      })
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
    const uploadImage = async (src): Promise<{ id: number,width:number,height:number, src: string, small: string }> => {
      const dataURL = await getImageBase64(src)
      const image= await loadImage(dataURL)
      const blob = base64ToBlob(dataURL);
      const formData = new FormData();
      formData.append('file', blob);
      const id = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { id: new Date().getTime(),width:image.width,height:image.height, src: `http://localhost:7899/image/${id}`, small: `http://localhost:7899/image/${id}` }
    }

    const uploadImageData = async (dataURL): Promise<{  id: number,width:number,height:number, src: string, small: string }> => {
      const image= await loadImage(dataURL)
      const blob = base64ToBlob(dataURL);
      const formData = new FormData();
      formData.append('file', blob);
      const id = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { id: new Date().getTime(),width:image.width,height:image.height, src: `http://localhost:7899/image/${id}`, small: `http://localhost:7899/image/${id}` }
    }
    // const uploadImage = async (href): Promise<{ id: number, src: string,small:string }> => {
    //   const dataURL = await getImageBase64(href)
    //   const blob = base64ToBlob(dataURL);
    //   const id = new Date().getTime();
    //   const src = URL.createObjectURL(blob);
    //   const imageSrc = `${window.location.origin}/image/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { id: id, src: imageSrc,small:imageSrc }
    // }

    // const uploadImageData = async (dataURL): Promise<{ id: number, src: string ,small:string}> => {
    //   const blob = base64ToBlob(dataURL);
    //   const id = new Date().getTime();
    //   const src = URL.createObjectURL(blob);
    //   const imageSrc = `${window.location.origin}/image/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { id: id, src: imageSrc,small:imageSrc }
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
  }
  async createSmailImage(id) {
    const loadImage = async (src): Promise<HTMLImageElement> => {
      return new Promise((r, j) => {
        var img = new Image();
        img.src = src;
        img.onload = function () {
          r(img)
          j(img)
        };
      })
    }

    // const createSmailImage = async (href, id) => {
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

    const createSmailImage = async (href, id) => {
      const img = await loadImage(href);
      const req = await fetch(href);
      const blob = await req.blob();
      const thumbnailBlob = await compressAccurately(blob, { size: 50, accuracy: 0.9, width: 200, orientation: 1, scale: 0.5, })
      const formData = new FormData();
      formData.append('file', thumbnailBlob);
      const idc = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { small: `http://localhost:7899/image/${idc}`, width: img.width, height: img.height }
    }
    const comics: any = await firstValueFrom(this.db.getByKey('comics', id))
    for (let i = 0; i < comics.chapters.length; i++) {
      const x = comics.chapters[i].images[0];
      if (!x.small && this.isLeave) {
        const res = await createSmailImage(x.src, x.id);

        this.comics.chapters[i].images[0].small = res.small;
        this.comics.chapters[i].images[0].width = res.width;
        this.comics.chapters[i].images[0].height = res.height;

        comics.chapters[i].images[0].small = res.small;
        comics.chapters[i].images[0].width = res.width;
        comics.chapters[i].images[0].height = res.height;
        await firstValueFrom(this.db.update('comics', comics))
      }
    }
    for (let i = 0; i < comics.chapters.length; i++) {
      const x = comics.chapters[i];
      for (let j = 0; j < x.images.length; j++) {
        if (comics.chapters[i].images[j].width||comics.chapters[i].images[j].height) continue
        if (!!comics.chapters[i].images[j].small && this.isLeave) continue
        const res = await createSmailImage(comics.chapters[i].images[j].src, comics.chapters[i].images[j].id)

        this.comics.chapters[i].images[j].small = res.small;
        this.comics.chapters[i].images[j].width = res.width;
        this.comics.chapters[i].images[j].height = res.height;

        comics.chapters[i].images[j].small = res.small;
        comics.chapters[i].images[j].width = res.width;
        comics.chapters[i].images[j].height = res.height;
        await firstValueFrom(this.db.update('comics', comics))
      }
    }
  }
}
