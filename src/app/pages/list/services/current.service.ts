import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService } from 'src/app/library/public-api';
declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  constructor(
    public DbController: DbControllerService,
    public Data: DataService
  ) {
    window.comics_query=()=>this.queryComics();
  }

  async init() {

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
