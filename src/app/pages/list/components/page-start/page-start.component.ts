import { Component } from '@angular/core';
import { LanguageSettingsService } from '../language-settings/language-settings.service';

@Component({
  selector: 'app-page-start',
  templateUrl: './page-start.component.html',
  styleUrl: './page-start.component.scss'
})
export class PageStartComponent {
  is_exist_window_gh_fetch=false;
  is_first_settngs_language=false;
  constructor(public LanguageSettings:LanguageSettingsService,) {
    this.is_exist_window_gh_fetch=!!window._gh_fetch;
    this.is_first_settngs_language=!!localStorage.getItem('is_first_settngs_language');
  }

  on() {
    const c = document.querySelector("base").href + 'assets/zip/extended.zip';
    this.downloadFile(c, '游戏手柄与漫画插件')
  }

  on2(){
    this.LanguageSettings.open();
  }


  downloadFile(url, fileName) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
        link.click();
      });
  }
}
