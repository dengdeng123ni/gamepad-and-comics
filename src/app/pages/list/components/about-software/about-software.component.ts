import { Component } from '@angular/core';
import { CacheControllerService } from 'src/app/library/public-api';

@Component({
  selector: 'app-about-software',
  templateUrl: './about-software.component.html',
  styleUrl: './about-software.component.scss'
})
export class AboutSoftwareComponent {
  size = 0;
  constructor(private webCh: CacheControllerService,) {
    navigator.storage.estimate().then(estimate => {

      this.size = this.formatSizeUnits(estimate.usage)
    });
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
