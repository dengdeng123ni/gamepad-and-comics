import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PulgService {


  caches!: Cache;
  constructor(private webDb: NgxIndexedDBService, private sanitizer: DomSanitizer) {


  }
  async init() {
    this.caches = await caches.open('script');
    await this.loadAllScript();
  }
  async openFile() {
    const files = await (window as any).showOpenFilePicker()
    const blob = await files[0].getFile();
    const url = `http://localhost:7700/script/${blob.name}`;
    const response = new Response(blob);
    const request = new Request(url);
    await this.caches.put(request, response);
  }
  async registerScript(id: string, blob: any, option = {}) {

  }
  async loadAllScript() {
    const list = await this.caches.matchAll()
    for (let index = 0; index < list.length; index++) {
      const e = list[index];
      const blob = await e.blob();
      const url:any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      this.loadJS(url.changingThisBreaksApplicationSecurity)
    }

    // const list = await firstValueFrom(this.webDb.getAll('script'))

  }

  loadJS(url){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
    //document.getElementsByTagName('body')[0].appendChild(script);
}


}
