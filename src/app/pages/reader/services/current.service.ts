import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  lastReadTime: number,
  chapters: Array<Chapters>,
  images: Array<any>
}
interface Chapters {
  id: number;
  date: number;
  images: Array<{
    id: number;
    src: string;
  }>
  title: string
}
interface Chapter {
  id: number;
  index: number;
  title: string;
  total: number;
}

interface ImageReadingTime {
  id: number;
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
        if (this.comics.mode == 1 || this.comics.mode == 4) {
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
      if ((x.endTime - x.startTime) > 2000) {
        this.db.update('image_state', x).subscribe()
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
    forkJoin([this.db.getByKey('comics', id), this.db.getByKey('state', id)]).subscribe(async (x: any) => {
      this.comics = { ...x[0], ...x[1] };
      if (this.comics.chapter.index === undefined) this.comics.chapter.index = 0;
      this.mode$.next(this.comics.mode)
      // this.insert(id, this.comics.chapters[0].id, this.comics.chapters[0].images[0].id)
    })
  }
  close() {
    if (this.comics.chapter.index != 0) this.db.update('chapter_state', this.comics.chapter).subscribe()
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
  pageChange(index: number) {
    if (0 <= index && index < this.comics.chapter.total) {
      this.pageBefore$.next(index);
      this.page$.next(index);
      this.pageAfter$.next(index);
    }
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
    const state = { chapter: { id: chapter.id, index: chapter.index, title: chapter.title, total: chapter.total }, lastReadTime: new Date().getTime(), id: this.comics.id, images: this.comics.images, mode: this.comics.mode, };
    this.db.update('state', state).subscribe()
  }
  async insertPage(comicsId: number, chaptersId: number, imageId: number, imageData = "", direction = "before") {
    const loadImage = (src): Promise<any> => {
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
    const uploadImage = async (src): Promise<{ id: number, src: string }> => {
      const dataURL = await getImageBase64(src)
      const blob = base64ToBlob(dataURL);
      const formData = new FormData();
      formData.append('file', blob);
      const id = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { id: new Date().getTime(), src: `http://localhost:7899/image/${id}` }
    }

    const uploadImageData = async (dataURL): Promise<{ id: number, src: string }> => {
      const blob = base64ToBlob(dataURL);
      const formData = new FormData();
      formData.append('file', blob);
      const id = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      return { id: new Date().getTime(), src: `http://localhost:7899/image/${id}` }
    }
    // const uploadImage = async (href): Promise<{ id: number, src: string }> => {
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
    //   return { id: id, src: imageSrc }
    // }

    // const uploadImageData = async (dataURL): Promise<{ id: number, src: string }> => {
    //   const blob = base64ToBlob(dataURL);
    //   const id = new Date().getTime();
    //   const src = URL.createObjectURL(blob);
    //   const imageSrc = `${window.location.origin}/image/${id}`;
    //   const request = new Request(imageSrc);
    //   const response = await fetch(src)
    //   const cache = await caches.open('image');
    //   await cache.put(request, response);
    //   URL.revokeObjectURL(src)
    //   return { id: id, src: imageSrc }
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
      return obj
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

}
