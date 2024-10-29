import { Component } from '@angular/core';
import { PulgService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-pulg-javascript',
  templateUrl: './pulg-javascript.component.html',
  styleUrl: './pulg-javascript.component.scss'
})
export class PulgJavascriptComponent {
  list = [];
  constructor(public pulg: PulgService,public data:DataService) {
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
    this.data.menu=[];
    this.data.is_init_free=false;
    setTimeout(()=>{
      this.data.is_init_free=true;
    },100)

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
