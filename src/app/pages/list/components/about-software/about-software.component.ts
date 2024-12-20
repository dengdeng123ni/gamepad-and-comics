import { Component } from '@angular/core';
import { CacheControllerService, NotifyService, PromptService } from 'src/app/library/public-api';

@Component({
  selector: 'app-about-software',
  templateUrl: './about-software.component.html',
  styleUrl: './about-software.component.scss'
})
export class AboutSoftwareComponent {
  size = 0;
  clientId = localStorage.getItem('clientId');
  clientName = localStorage.getItem('clientName');


  local_ip="";
  local_network_ip="";
  constructor(
    private webCh: CacheControllerService,
    public prompt: PromptService,
    public Notify: NotifyService

  ) {
    navigator.storage.estimate().then(estimate => {

      this.size = this.formatSizeUnits(estimate.usage)
    });
    this.init()
  }
  init(){
    fetch("http://localhost:7708/api/get/ip").then(res=>res.json()).then(res=>{
      this.local_ip=`http://localhost:7708`;
      this.local_network_ip=`https://${res.IP}:7707`;
    })
  }
  formatSizeUnits(bytes) {
    if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1) { bytes = bytes + " bytes"; }
    else if (bytes == 1) { bytes = bytes + " byte"; }
    else { bytes = "0 bytes"; }
    return bytes;
  }

  opeo() {
    window.open('https://github.com/dengdeng123ni/gamepad-and-comics-v3')
  }

  open2() {
    window.open('https://store.steampowered.com/app/2070500/Gamepad_and_Comics/')

  }
  open3() {
    window.open('https://qm.qq.com/q/Dc2xkSPgMo')

  }
  copy(e) {
    navigator.clipboard.writeText(e);
    this.Notify.messageBox("复制成功")
  }
  async rename() {
    const name = await this.prompt.fire("请输入新名称", "");
    if (name === null) {
    } else if (name === "") {
    } else {
      this.clientName = name;
      localStorage.setItem('clientName', name);
    }
  }

  async del() {


    if (confirm("你确定要清除所有缓存吗？")) {
      if ('caches' in window) {
        await caches.delete('image');
      }
      // 清除所有 IndexedDB 数据库
      if (window.indexedDB && indexedDB.databases) {
        indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => {
            indexedDB.deleteDatabase(db.name);
          });
        });
      }
      location.reload();
    } else {
      console.log("用户选择了取消");
    }
  }
  async update222() {
    if (confirm("你确定要强制更新吗?")) {
      await caches.delete('assets');
      location.reload();
    } else {

    }
  }
}
