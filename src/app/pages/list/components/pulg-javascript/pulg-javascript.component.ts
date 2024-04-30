import { Component } from '@angular/core';
import { PulgService } from 'src/app/library/public-api';

@Component({
  selector: 'app-pulg-javascript',
  templateUrl: './pulg-javascript.component.html',
  styleUrl: './pulg-javascript.component.scss'
})
export class PulgJavascriptComponent {
  list = [];
  constructor(public pulg: PulgService) {
    this.init();
  }
  async init() {
    const res: any = await this.pulg.getAll()
    this.list = res.map(x => ({
      name: x.url.slice('http://localhost:7700/script/'.length, 1000),
      url: x.url
    }))
  }

  async del(url) {
    await this.pulg.delete(url)
    await this.init();
  }

  async add() {
    await this.pulg.openFile();
    await this.init();
  }
  async on(e) {
   const url= await this.pulg.get(e.url);
    const download = (filename, url) => {
      let a = document.createElement('a');
      a.download = filename;
      a.href = url;
      document.body.appendChild(a);
      a.click(); // 触发a标签的click事件
      document.body.removeChild(a);
    }
    download(e.name,url)
  }
}
