import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { DbEventService, GamepadEventService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { MenuSearchService } from './menu-search.service';
import { WhenInputtingService } from '../when-inputting/when-inputting.service';

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
    public GamepadEvent:GamepadEventService,
    public MenuSearch:MenuSearchService,
    public WhenInputting:WhenInputtingService,
    public current:CurrentService
  ) {

    Object.keys(DbEvent.Events).forEach(x=>{
      if(DbEvent.Events[x].Search){
         this.arr.push(DbEvent.Configs[x])
      }
    });
    this.init();
    this.WhenInputting.open();

    GamepadEvent.registerAreaEvent("menu_search_input", {
      A: e => {

        if(document.activeElement.tagName=="INPUT"){
          e.querySelector("input").blur();
          this.WhenInputting.close();
        }
        this.WhenInputting.open();
        e.querySelector("input").focus();


      },
      B: e => {
        e.querySelector("input").blur();
        this.WhenInputting.close();
      }
    })

  }


  async init() {
    this.comics_list =( await firstValueFrom(this.webDb.getAll('history')) as any).sort((a, b) => b.last_read_date - a.last_read_date)
    this.filter_comics_list= this.comics_list.slice(0,20)
  }
  focus(){
    this.WhenInputting.open();
  }
  blur(){
    this.WhenInputting.close();
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
  on(e){
    this.MenuSearch.close();
    this.current.routerReader(e.source,e.id)
  }
  on2(e){
    this.MenuSearch.close();

    this.current.routerSourceSearch(e.id,window.btoa(encodeURIComponent(this.keyword)))
  }

  ngAfterViewInit(){

   setTimeout(()=>{
    (document.querySelector("#input_v1c") as any).focus();
   },200)
  }
}
