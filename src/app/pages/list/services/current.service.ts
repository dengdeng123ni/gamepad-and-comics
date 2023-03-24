import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom, forkJoin, Subject } from 'rxjs';
interface List {
  _id: string,
  name: string,
  author?: string,
  coverImage: string,
  tags?: Array<string>
  creationTime?: number | Date,
  updateTime?: number | Date,
}
@Injectable({
  providedIn: 'root'
})
export class CurrentListService {

  list: Array<any> = [];


  constructor(
    private http: HttpClient,
    private db: NgxIndexedDBService,
    public router: Router,
    public sanitizer: DomSanitizer,
  ) {


  }

  public upload$ = new Subject();
  public edit$ = new Subject<boolean>();
  public edit() {
    return this.edit$
  }

  init() {
    this.getComicsInfoAll();
  }
  async getComicsInfoAll() {
    const getImage = async (src) => {
      const cache = await caches.open('image');
      const res = await cache.match(src)
      const blob = await res.blob()
      const img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      return img
    }
    const x: any = await firstValueFrom(forkJoin([this.db.getAll('comics'), this.db.getAll('state')]))
    const list = x[0].map((s, j) => ({ ...s, ...x[1][j] }))
    list.forEach(x => {
      x.subTitle = x.chapter.title
    });
    this.list = list;

  }
  async delete(id) {
    let chapterIds = [];
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
    // const detaleDbImageInfo = async (ids) => {
    //   for (let i = 0; i < ids.length; i++) {
    //     const id = ids[i];
    //     const res = await cache.delete(`${window.location.origin}/image/${id}`)
    //   }
    // }
    // const detaleDbChapter = async (ids) => {
    //   for (let i = 0; i < ids.length; i++) {
    //     const id = ids[i];
    //     const res = await cache.delete(`${window.location.origin}/chapter_thumbnail/${id}`)
    //   }
    // }
    this.db.getByKey('comics', id).subscribe((x: any) => {
      chapterIds = x.chapters.map(x => x.id);
      x.chapters.forEach(x => x.images.forEach(c => imageIds.push(c.id)));
      detaleCacheImage(imageIds);
      detaleCacheChapter(chapterIds)
      forkJoin([this.db.delete('comics',id), this.db.delete('state',id)]).subscribe(()=> this.getComicsInfoAll())
    })

  }


}
