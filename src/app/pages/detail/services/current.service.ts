import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
@Injectable({
  providedIn: 'root'
})
export class CurrentDetailService {
  comics: Comics = null;
  constructor(
    private db: NgxIndexedDBService,
    public router: Router
  ) {

    this.onThumbnailItemClick$.subscribe(x => {
      const { event$, data } = x;
      this.update_state(data, data.index);
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
    forkJoin([this.db.getByKey('comics', id), this.db.getByKey('state', id)]).subscribe(async (x: any) => {
      const comics = { ...x[0], ...x[1] }
      this.comics = comics;
      this.afterInit$.next(this.comics);
    })
  }

  update_state(chapter, index?) {
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

  async delete(chapterIds: Array<number>) {
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
      this.db.update('comics',comics).subscribe(()=>{
         this.init(comics.id);
      })
    })
    // this.comics.id;

  }
}
