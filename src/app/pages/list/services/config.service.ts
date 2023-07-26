import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigListService {

  constructor() {
    this.init();
  }

  edit = false;

  view={
    scrollTop:0,
    id:""
  }

  page={
    comics_item_size:"middle", // large
    is_page:false
  }

  type="local"

  list_menu_config={
    server:[],
    select:{}
  }

  temporary={
    list:[],
  };

  init(){
    const comics_item_size=localStorage.getItem("comics_item_size")
    const comics_is_page=localStorage.getItem("comics_is_page")
    const list_menu_config=localStorage.getItem("list_menu_config")
    if(comics_item_size){
      this.page.comics_item_size=comics_item_size;
      this.page.is_page=comics_is_page=="true";
    }
    if(list_menu_config){
      this.list_menu_config=JSON.parse(list_menu_config) as any;
    }
  }

  save_list_menu_config(){
    localStorage.setItem("list_menu_config",JSON.stringify(this.list_menu_config))
  }

}
