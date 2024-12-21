import { Injectable } from '@angular/core';
import { NotifyService, PromptService, PulgService } from 'src/app/library/public-api';
@Injectable({
  providedIn: 'root'
})
export class WebpageOfflineService {


  constructor(
    public Prompt: PromptService,
    public Notify: NotifyService,
    public pulg: PulgService
  ) {

  }

  async enter() {
    const bool = await this.Prompt._confirm("网页离线", "进入网页离线,只会缓存网页资源,恒定版本,不影响其他");
    if (bool) {
      if (document.body.getAttribute('receiver_client_id')) {
        await this.Notify.messageBox("关闭当前通道")
        return
      }
      if (window.location.protocol == "https:") {

        const is_pwa = this.isPWA();
        if (is_pwa) {
          await this.pulg.loadAllAssets();
          await this.Notify.messageBox("已完成")
        } else {
          await this.Notify.messageBox("当前网站不是PWA")
        }

      } else {
        await this.Notify.messageBox("当前网站不是PWA")
      }
    } else {

    }
  }

  isPWA() {
    return 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
  }


  async exit() {
    const bool = await this.Prompt._confirm("网页离线", "退出网页离线,会强制更新,确认吗");
    if (bool) {
      await caches.delete('assets');
      location.reload();
      await this.Notify.messageBox("已完成")
    } else {

    }
  }

}
