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
    isPageTurnDirection: true,
    pageOrder: false,
    slidingDirection: "vertical",
  }
  mode2 = {
    width: 50,
  }
  mode3 = {
    isPageTurnDirection: false,
  }
  mode4 = {
    isPageTurnDirection: true,
    slidingDirection: "vertical"
  }

  save() {
    const obj = {
      mode1: this.mode1,
      mode2: this.mode2,
      mode3: this.mode3,
      mode4: this.mode4,
    }
    localStorage.setItem('reader_config', JSON.stringify(obj))
  }

  init() {
    const obj = JSON.parse(localStorage.getItem('reader_config'))
    if (obj) {
      this.mode1 = this.deepMerge(this.mode1,obj.mode1);
      this.mode2 = this.deepMerge(this.mode2, obj.mode2);
      this.mode3 = this.deepMerge(this.mode3, obj.mode3);
      this.mode4 = this.deepMerge(this.mode4, obj.mode4);
    }

  }

  close() {
    this.mode = -1;
  }
  deepMerge(obj1, obj2) {
    let key;
    for (key in obj2) {
      obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ? this.deepMerge(obj1[key], obj2[key]) : (obj1[key] = obj2[key]);
    }
    return obj1;
  }
}
