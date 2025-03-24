import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
@Injectable({
  providedIn: 'root'
})
export class GamesSavesService {


  _data = {};

  constructor(public Electron:ElectronService,) {




  }

  async init() {
    const files= await this.Electron.getLoadFiles() as any;
    for (let index = 0; index < files.length; index++) {
      this.loadJS(files[index])
    }
  }
  loadJS(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${url}`;
    document.body.appendChild(script);
  }

  getLoadFiles(){

  }




}
