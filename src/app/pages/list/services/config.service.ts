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
    comics_item_size:"large"
  }
  init(){
    const comics_item_size=localStorage.getItem("comics_item_size")
    if(comics_item_size){
      this.page.comics_item_size=comics_item_size;
    }
  }
}
