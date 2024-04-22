import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService } from 'src/app/library/public-api';
import { Subject, firstValueFrom } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';
declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  public query$ = new Subject();
  public change$ = new Subject();
  constructor(
    public DbController: DbControllerService,
    public router: Router,
    public webDb: NgxIndexedDBService,
    public Data: DataService
  ) {
    window.comics_query=()=>this.queryComics();
  }

  async init() {

  }
  public query() {
    return this.query$
  }

  public _query(e) {
     this.query$.next(e)
  }

  public change() {
    return this.change$
  }

  public _change(e) {
    this.change$.next(e)
  }
  async getList() {
    const id = this.utf8_to_b64(JSON.stringify(window.comics_query_option))
    const list = await this.DbController.getList(id);
    return list
  }
  async queryComics(){
    const id = this.utf8_to_b64(JSON.stringify(window.comics_query_option))
    const list = await this.DbController.getList(id);
    this.Data.list=list;
    this._change(this.Data.list)
  }
  utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  async routerReader(comics_id){
    const _res:any = await Promise.all([this.DbController.getDetail(comics_id), await firstValueFrom(this.webDb.getByID("read_comics", comics_id.toString()))])


    if(_res[1]){
      this.router.navigate(['/', comics_id, _res[1].chapter_id])
    }else{
      this.router.navigate(['/', comics_id, _res[0].chapters[0].id])
    }
  }


  continue() {

  }

}
