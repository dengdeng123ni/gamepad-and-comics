import { Component } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { DbControllerService, DbEventService, GamepadEventService, IndexdbControllerService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { MenuSearchService } from './menu-search.service';
import { WhenInputtingService } from '../when-inputting/when-inputting.service';
import { Router } from '@angular/router';

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

  constructor(public webDb: IndexdbControllerService,
    public DbEvent:DbEventService,
    public GamepadEvent:GamepadEventService,
    public MenuSearch:MenuSearchService,
    public WhenInputting:WhenInputtingService,
    public DbController:DbControllerService,
    public router: Router,
    public current:CurrentService
  ) {

    Object.keys(DbEvent.Events).forEach(x=>{
      if(DbEvent.Events[x].Search){
         this.arr.push(DbEvent.Configs[x])
      }
    });
    this.init();
    // this.WhenInputting.open();

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

        if(document.activeElement.tagName=="INPUT"){
          e.querySelector("input").blur();
          this.WhenInputting.close();
        }else{
          this.MenuSearch.close()
        }
      }
    })

  }


  async init() {
    this.comics_list =( await this.webDb.getAll('history') as any).sort((a, b) => b.last_read_date - a.last_read_date)
    this.comics_list= this.comics_list.filter(x=>x.source!="temporary_file")
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
    if(this.DbEvent.Configs[e.source].type=="comics"){
      this.MenuSearch.close();
      this.current.routerReader(e.source,e.id)
    }else if(this.DbEvent.Configs[e.source].type=="novels"){
      this.MenuSearch.close();
      this.routerNovelsReader(e.source,e.id)
    }else{
      this.MenuSearch.close();
      this.current.routerReader(e.source,e.id)
    }


  }
  async routerNovelsReader(source, comics_id) {
    const _res: any = await Promise.all([this.DbController.getDetail(comics_id), await this.webDb.getByKey("last_read_comics", comics_id.toString())])
    if (_res[1]) {
      this.router.navigate(['/novels', source, comics_id, _res[1].chapter_id])
    } else {
      this.router.navigate(['/novels', source, comics_id, _res[0].chapters[0].id])
    }
  }
  on2(e){
    this.MenuSearch.close();

    this.current.routerSourceSearch(e.id,window.btoa(encodeURIComponent(this.keyword)))
  }

  ngAfterViewInit(){
    // setTimeout(()=>{
    //   (document.querySelector("#input_v1c") as any).focus();
    //  },200)
  }
}
