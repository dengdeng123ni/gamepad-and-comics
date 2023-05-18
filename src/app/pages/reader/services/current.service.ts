import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  lastReadTime: number;
  chapters: Array<Chapters>;
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
  }>
  title: string,
  lastReadTime?: number
}
interface Chapter {
  id: number;
  index: number;
  title: string;
  total: number;
}

interface ImageReadingTime {
  id?: number;
  imageId: number;
  chapterId: number;
  comicsId: number;
  startTime: number;
  endTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentReaderService {
  comics: Comics = null;
  imageStates=[];
  isLeave: boolean = false;
  constructor(
    private db: NgxIndexedDBService,
    private http: HttpClient,
  ) {
    this.page$.subscribe(x => {
      if (x < 0) x = 0
      this.comics.chapter.index = x;
      this.update_state(this.comics.chapter, x);
    })
    this.on$.subscribe(event$ => {

      const { x, y } = event$;
      const { innerWidth, innerHeight } = window;
      if (x > (innerWidth * 0.33) && x < (innerWidth * 0.66) && y > (innerHeight * 0.33) && y < (innerHeight * 0.66)) {
        this.readerNavbarBar$.next(true)
      } else {

        if (this.comics.mode == 1 || this.comics.mode == 4 || this.comics.mode == 2) {
          if (x < (innerWidth / 2)) this.previousPage$.next(event$)
          else this.nextPage$.next(event$)
        }
      }
    })
    this.onChaptersItemClick$.subscribe(x => {
      const { data } = x;
      this.chapterChange(data.id);
      this.readerNavbarBar$.next(false)
    })
    this.chapterBefore$.subscribe(x => {
      if (x.index == 0) return
      if ((x.total - 2) <= x.index) {
        const chapters = this.comics.chapters;
        const chaptersIndex = chapters.findIndex(s => s.id == x.id);
        x.index = 0;
        // if ((chapters.length - 1) != chaptersIndex) x.index = 0;
      }
      this.db.update('chapter_state', x).subscribe()
    })
    this.imageReadingTime$.subscribe(x => {
      if ((x.endTime - x.startTime) > 2000 && x.startTime && x.endTime) {
        setTimeout(() => {
          if ((x.endTime - x.startTime) < 120000) {
            x.endTime = x.startTime + 15000 + (15000 * Math.random());
          }
          const id = new Date().getTime();
          x.startTime = Math.ceil(x.startTime);
          x.endTime = Math.ceil(x.endTime);
          this.db.update('image_state', { id: id, ...x }).subscribe()
        }, 300 * Math.random())
      }
    })

  }

  public mode$ = new Subject<number>();

  public on$ = new Subject<PointerEvent>();

  public delete$ = new Subject();
  public afterInit$ = new Subject();

  public pageBefore$ = new Subject<number>();
  public page$ = new Subject<number>();
  public pageAfter$ = new Subject<number>();

  public chapterBefore$ = new Subject<Chapter>();
  public chapter$ = new Subject<Chapters>();
  public chapterAfter$ = new Subject<Chapter>();

  public imageReadingTime$ = new Subject<ImageReadingTime>();

  public last$ = new Subject();
  public first$ = new Subject();

  public pageFirstBefore$ = new Subject<void>();
  public pageLastAfter$ = new Subject<void>();

  public chapterEnd$ = new Subject();
  public chapterStart$ = new Subject();
  public chapterPrevious$ = new Subject<Chapters>();
  public chapterNext$ = new Subject<Chapters>();

  public chapterFirstBefore$ = new Subject<void>();
  public chapterLastAfter$ = new Subject<void>();


  public switch$ = new Subject();
  public readerNavbarBar$ = new Subject();

  public previousPage$ = new Subject();
  public nextPage$ = new Subject();

  public onChaptersItemClick$ = new Subject<{ event$: PointerEvent, data: Chapters }>();

  public previousPage() {
    return this.previousPage$
  }

  public nextPage() {
    return this.nextPage$
  }

  public readerNavbarBar() {
    return this.readerNavbarBar$
  }

  public switch() {
    return this.switch$
  }

  public delete() {
    return this.delete$
  }
  public afterInit() {
    return this.afterInit$
  }
  public page() {
    return this.page$
  }
  public chapter() {
    return this.chapter$
  }
  public last() {
    return this.last$
  }
  public first() {
    return this.first$
  }
  public chapterEnd() {
    return this.chapterEnd$
  }
  public chapterStart() {
    return this.chapterStart$
  }
  public chapterPrevious() {
    return this.chapterPrevious$
  }
  public chapterNext() {
    return this.chapterNext$
  }
  public chapterBefore() {
    return this.chapterBefore$
  }
  public pageBefore() {
    return this.pageBefore$
  }
  public pageAfter() {
    return this.pageAfter$
  }
  async init(id) {
    id = parseInt(id);

    this.isLeave = false;

    forkJoin([this.db.getByKey('comics', id), this.db.getByKey('state', id)]).subscribe(async (x: any) => {
      this.comics = { ...x[0], ...x[1] };

      this.comics.chapters.forEach(c => {
        c.images.forEach((j, i) => {
          if (!c.images[i].small) c.images[i].small = c.images[i].src;
          if (!c.images[i].width) c.images[i].width = 0;
          if (!c.images[i].height) c.images[i].height = 0;
        })
      })

      if (this.comics.chapter.index === undefined) this.comics.chapter.index = 0;
      this.mode$.next(this.comics.mode)
      setTimeout(() => { this.createSmailImage(id) }, 1000)
      setTimeout(() => { this.getChapterLastReadingDate(); }, 800)
      // this.insert(id, this.comics.chapters[0].id, this.comics.chapters[0].images[0].id)
    })
  }
  close() {
    if (this.comics.chapter.index != 0) this.db.update('chapter_state', this.comics.chapter).subscribe()
    this.isLeave = true;
  }
  chapterChange(id: number) {
    this.chapterBefore$.next(this.comics.chapter);
    const chapters = this.comics.chapters;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex];
    if (chapter) {
      this.db.getByID('chapter_state', chapter.id).subscribe((x: Chapter) => {
        if (x) {
          this.comics.chapter = { id: chapter.id, title: chapter.title, index: x.index, total: chapter.images.length };
          this.chapter$.next(chapter);
        } else {
          this.comics.chapter = { id: chapter.id, title: chapter.title, index: 0, total: chapter.images.length };
          this.chapter$.next(chapter);
        }
      })
    }
  }
  chapterPageChange(chapterId, index) {
    this.chapterBefore$.next(this.comics.chapter);
    const chapters = this.comics.chapters;
    const chaptersIndex = chapters.findIndex(x => x.id == chapterId);
    const chapter = chapters[chaptersIndex];
    if (chapter) {
      this.comics.chapter = { id: chapter.id, title: chapter.title, index: index, total: chapter.images.length };
      this.chapter$.next(chapter);
    }
  }
  pageChange(index: number) {
    this.pageBefore$.next(index);
    this.page$.next(index);
    this.pageAfter$.next(index);
  }

  previousLast() {
    const chapters = this.comics.chapters;
    const { id } = this.comics.chapter;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex - 1];
    if (chapter) {
      this.comics.chapter = { id: chapter.id, title: chapter.title, index: chapter.images.length - 1, total: chapter.images.length };
      this.chapter$.next(chapter);
    } else {
      this.pageFirstBefore$.next();
    }
  }

  nextFirst() {
    const chapters = this.comics.chapters;
    const { id } = this.comics.chapter;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex + 1];
    if (chapter) {
      this.comics.chapter = { id: chapter.id, title: chapter.title, index: 0, total: chapter.images.length };
      this.chapter$.next(chapter);
    } else {
      this.pageLastAfter$.next();
    }
  }

  previous() {
    this.chapterBefore$.next(this.comics.chapter);
    const chapters = this.comics.chapters;
    const { id } = this.comics.chapter;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex - 1];
    if (chapter) {
      this.chapterPrevious$.next(chapter);
      this.chapterChange(chapter.id);
    } else {
      this.chapterFirstBefore$.next()
    }
  }

  next() {
    this.chapterBefore$.next(this.comics.chapter);
    const chapters = this.comics.chapters;
    const { id } = this.comics.chapter;
    const chaptersIndex = chapters.findIndex(x => x.id == id);
    const chapter = chapters[chaptersIndex + 1];
    if (chapter) {
      this.chapterNext$.next(chapter);
      this.chapterChange(chapter.id);
    } else {
      this.chapterLastAfter$.next()
    }
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
  async insertPage(comicsId: number, chaptersId: number, imageId: number, imageData = "", direction = "before") {
    const loadImage = async (imageUrl): Promise<ImageBitmap> =>  await createImageBitmap(await fetch(imageUrl).then((r) => r.blob()))
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
    // const uploadImage = async (href): Promise<{ id: number, width: number, height: number, src: string, small: string }> => {
    //   const dataURL = await getImageBase64(href)
    //   const image = await loadImage(dataURL)
    //   const blob = base64ToBlob(dataURL);
    //   const id = new Date().getTime();
    //   const src = URL.createObjectURL(blob);
    //   const imageSrc = `${window.location.origin}/image/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { id: id, src: imageSrc, small: imageSrc, width: image.width, height: image.height, }
    // }

    // const uploadImageData = async (dataURL): Promise<{ id: number, width: number, height: number, src: string, small: string }> => {
    //   const image = await loadImage(dataURL)
    //   const blob = base64ToBlob(dataURL);
    //   const id = new Date().getTime();
    //   const src = URL.createObjectURL(blob);
    //   const imageSrc = `${window.location.origin}/image/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { id: id, src: imageSrc, small: imageSrc, width: image.width, height: image.height, }
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
    const loadImage = async (imageUrl): Promise<ImageBitmap> =>  await createImageBitmap(await fetch(imageUrl).then((r) => r.blob()))
    const chapters = this.comics.chapters;
    const chaptersIndex = chapters.findIndex(x => x.id == this.comics.chapter.id);

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
    const createSmailImage = async (href, id) => {
      const req = await fetch(href);
      const blob = await req.blob();
      const img = await createImageBitmap(blob)
      const thumbnailBlob = await compressAccurately(blob, { size: 50, accuracy: 0.9, width: 200, orientation: 1, scale: 0.5, })
      const formData = new FormData();
      formData.append('file', thumbnailBlob);
      const idc = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { small: `http://localhost:7899/image/${idc}`, width: img.width, height: img.height }
    }
    const comics: any = await firstValueFrom(this.db.getByKey('comics', id))
    for (let i = chaptersIndex; i <= chaptersIndex; i++) {
      const x = comics.chapters[i];
      for (let j = 0; j < x.images.length; j++) {

        if (comics.chapters[i].images[j].width || comics.chapters[i].images[j].height) continue
        if (!!comics.chapters[i].images[j].small) continue
        if (this.isLeave) return

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
    for (let i = 0; i < comics.chapters.length; i++) {
      const x = comics.chapters[i];
      for (let j = 0; j < x.images.length; j++) {

        if (comics.chapters[i].images[j].width || comics.chapters[i].images[j].height) continue
        if (!!comics.chapters[i].images[j].small) continue
        if (this.isLeave) return
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
  updateChapterLastReadingDate(){

  }
}
