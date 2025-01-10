import { Component } from '@angular/core';

@Component({
  selector: 'app-page-start',
  templateUrl: './page-start.component.html',
  styleUrl: './page-start.component.scss'
})
export class PageStartComponent {
  is_google=false;
  is_baidu=false;
  async on(){
    try {
      const res=  await window._gh_fetch("https://www.google.com")
      this.is_google=true;
    } catch (error) {
      this.is_google=false;
    }
    try {
      await window._gh_fetch("https://www.baidu.com/")
      this.is_baidu=true;
    } catch (error) {
      this.is_baidu=false;
    }



  }
}
