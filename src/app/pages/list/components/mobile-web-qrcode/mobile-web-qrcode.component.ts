import { Component } from '@angular/core';
import { AppDataService, PulgService } from 'src/app/library/public-api';
import { MobileWebQrcodeService } from './mobile-web-qrcode.service';
declare let window: any;

@Component({
  selector: 'app-mobile-web-qrcode',
  templateUrl: './mobile-web-qrcode.component.html',
  styleUrl: './mobile-web-qrcode.component.scss'
})



export class MobileWebQrcodeComponent {
  url = '';
  src = '';
  constructor(
    public Pulg: PulgService,
    public AppData:AppDataService,
    public MobileWebQrcode: MobileWebQrcodeService


  ) {

    this.init();
  }
  async init() {
    const js = document.querySelector("base").href + 'assets/js/qrcode.min.js'
    await this.Pulg.loadBlobJs(js)
    setTimeout(() => {
      // window ''
      window.QRCode.toDataURL(`${this.AppData.local_network_url}?receiver_client_id=_420000000000&replace_channel_id=_gh_application&is_enabled=true`, { width: 265, heigth: 265 }, (error, url) => {
        this.url = url;
      });
    }, 50)
  }

  ngAfterViewInit() {

  }

  download() {
    const download = (filename, url) => {
      let a = document.createElement('a');
      a.download = filename;
      a.href = url;
      document.body.appendChild(a);
      a.click(); // 触发a标签的click事件
      document.body.removeChild(a);
    }
    download(this.src, this.url)
  }
}
