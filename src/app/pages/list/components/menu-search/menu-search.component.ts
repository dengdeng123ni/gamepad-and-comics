import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { DbEventService, GamepadEventService } from 'src/app/library/public-api';

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrl: './menu-search.component.scss'
})
export class MenuSearchComponent {

  comics_list = [];
  filter_comics_list=[];
  _keyword = "";

  arr=[];
  get keyword() { return this._keyword };
  set keyword(value: string) {
    this.filter_comics_list= this.filter(value)
    this._keyword = value;
  }

  constructor(public webDb: NgxIndexedDBService,
    public DbEvent:DbEventService,
    public GamepadEvent:GamepadEventService
  ) {

    Object.keys(DbEvent.Events).forEach(x=>{
      if(DbEvent.Events[x].Search){
         this.arr.push(DbEvent.Configs[x])
      }
    });
    this.init();
  }


  async init() {
    this.comics_list = await firstValueFrom(this.webDb.getAll('history'))
    this.filter_comics_list= this.comics_list
  }


  filter(str) {
    if(!str) return []
    let arr=[];
    this.comics_list.forEach(x=>{
      if(x&&x.title&&x.title.includes(str)){
        arr.push(x)
      }
    })
    return arr
  }
}
