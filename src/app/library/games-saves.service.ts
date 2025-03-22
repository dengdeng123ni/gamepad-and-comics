import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class GamesSavesService {


  _data = {};

  constructor() {




  }

  async init() {

    this.loadJS("file:///Users/zhiangzeng/Desktop/Documents/ccc")
  }
  loadJS(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${url}/index.js`;
    document.body.appendChild(script);
  }

  getLoadFiles(){

  }




}
