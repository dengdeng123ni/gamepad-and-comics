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
  all_list: Array<any> = [];
  selected = "all";

  constructor(
    private http: HttpClient,
    private db: NgxIndexedDBService,
    public router: Router,
    public sanitizer: DomSanitizer,
  ) {


  }

  public upload$ = new Subject();
  public edit$ = new Subject<boolean>();
  public init$ = new Subject<void>();
  public change$ = new Subject<void>();
  public initAfter$ = new Subject<void>();
  public edit() {
    return this.edit$
  }

  public initAfter() {
    return this.initAfter$
  }

  public _change() {
    return this.change$
  }

  init() {
    const id=localStorage.getItem("list_menu_selected_id");
    if(id) this.selected=id;
    this.getComicsInfoAll();
  }
  async getComicsInfoAll() {
    // if(this.all_list.length) return
    const x: any = await firstValueFrom(forkJoin([this.db.getAll('comics'), this.db.getAll('state')]))
    const list = x[0].map((s, j) => ({ ...s, ...x[1][j] }))
    list.forEach(x => {
      x.subTitle = x.chapter.title
    });
    this.all_list = list;
    this.change();
    this.initAfter$.next()
  }

  change(id?) {
    if(id) {
      this.selected=id;
      localStorage.setItem("list_menu_selected_id",id);
    }

    if (this.selected == "all") {
      this.list = this.all_list;
    } else if (this.selected == "local") {
      this.list = this.all_list.filter(x => x.origin == "local");
    } else {
      this.list = this.all_list.filter(x => x.config?.id == this.selected);
      if(this.list.length==0){
        const menu=JSON.parse(localStorage.getItem("list_menu_config"))
        let list=[];
        menu.server.forEach(x=>x.subscriptions.forEach(c=>list.push(c)))
        const obj=list.find(x=>x.id==this.selected);
        if(!obj) this.change("all");
      }
    }
    this.change$.next()
  }
  async delete(id) {
    let chapterIds = [];
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
      imageIds.push(x.cover.id)
      chapterIds = x.chapters.map(x => x.id);
      x.chapters.forEach(x => x.images.forEach(c => imageIds.push(c.id)));
      detaleCacheImage(imageIds);
      detaleCacheChapter(chapterIds)
      forkJoin([this.db.delete('comics', id), this.db.delete('state', id)]).subscribe(() => this.getComicsInfoAll())
    })

  }
  continue(id: number | string) {
    this.router.navigate(['/reader', id])
  }

}
