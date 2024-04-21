import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService } from 'src/app/library/public-api';
import { Subject } from 'rxjs';
declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  public query$ = new Subject();
  constructor(
    public DbController: DbControllerService,
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

  async getList() {
    const id = this.utf8_to_b64(JSON.stringify(window.comics_query_option))
    const list = await this.DbController.getList(id);
    return list
  }
  async queryComics(){
    const id = this.utf8_to_b64(JSON.stringify(window.comics_query_option))
    const list = await this.DbController.getList(id);
    this.Data.list=list;
  }
  utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }






}
