import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigReaderService {

  constructor() {
    this.init();
  }
  mode = -1;
  // order true 正序 反序 普通模式 日漫模式
  // horizontal vertical
  mode1 = {
    isFirstPageCover: true,
    isPageTurnDirection:true,
    pageOrder:false,
    slidingDirection:"vertical",
  }
  mode2 = {
    width:50,
  }
  mode3 = {
    isPageTurnDirection:false,
  }
  mode4 = {
    isPageTurnDirection:true,
    slidingDirection:"vertical"
  }

  save(){
    // const obj={
    //   mode1:this.mode1
    // }
    // localStorage.setItem('reader_config',JSON.stringify(obj))
  }

  init(){
  //  const obj=JSON.parse(localStorage.getItem('reader_config'))
  //  if(obj){
  //   this.mode1=obj.mode1;
  //  }
  }

  close(){
    this.mode=-1;
  }
}
