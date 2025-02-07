import { Component } from '@angular/core';
import { LanguageSettingsService } from '../language-settings/language-settings.service';
import { NotifyService, PromptService } from 'src/app/library/public-api';

@Component({
  selector: 'app-page-start',
  templateUrl: './page-start.component.html',
  styleUrl: './page-start.component.scss'
})
export class PageStartComponent {
  is_exist_window_gh_fetch=false;
  is_first_settngs_language=false;
  is_open_github=false;
  constructor(public LanguageSettings:LanguageSettingsService,
    public Prompt:PromptService,
    public Notify:NotifyService
  ) {
    this.is_exist_window_gh_fetch=!!window._gh_fetch;
    this.is_first_settngs_language=!!localStorage.getItem('is_first_settngs_language');
    if((window as any).electron){
      this.is_open_github=true;
    }else{
      this.is_open_github=!!localStorage.getItem('is_open_github');
    }
  }

  on() {
    const c = document.querySelector("base").href + 'assets/zip/extended.zip';
    this.downloadFile(c, '游戏手柄与漫画插件')
  }

  on2(){
    this.LanguageSettings.open();
  }
  on3(){
    localStorage.setItem('is_open_github', 'true');
    this.is_open_github=true;
    window.open('https://github.com/dengdeng123ni/gamepad-and-comics')
    this.Notify.messageBox('你的 Star 是对我们最大的支持！⭐️ 感谢你的关注！','',{duration:3000})
    //
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
