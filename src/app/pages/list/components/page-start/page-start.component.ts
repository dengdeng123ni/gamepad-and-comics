import { Component } from '@angular/core';

import CryptoJS from 'crypto-js'
@Component({
  selector: 'app-page-start',
  templateUrl: './page-start.component.html',
  styleUrl: './page-start.component.scss'
})
export class PageStartComponent {
  is_google = false;
  is_baidu = false;
  is_hentai = false;
  id = ""
  list = [];
  list2 = [];
  arr = [];
  async on() {

    // setTimeout(async () => {
    //   try {
    //     await window._gh_fetch("https://www.google.com")
    //     this.is_google = true;
    //   } catch (error) {

    //     this.is_google = false;
    //     this.arr.push(error)
    //   }
    // })
    // setTimeout(async () => {
    //   try {
    //     await window._gh_fetch("https://www.baidu.com/")
    //     this.is_baidu = true;
    //   } catch (error) {
    //     this.is_baidu = false;
    //     this.arr.push(error)
    //   }
    // })

    // setTimeout(async () => {
    //   try {
    //     const res = await window._gh_fetch("https://e-hentai.org/")
    //     this.is_hentai = true;
    //   } catch (error) {
    //     this.is_hentai = false;
    //     this.arr.push(error)
    //   }
    // })


    // setTimeout(async () => {
    //   try {
    //     const id = CryptoJS.MD5(JSON.stringify({ data: "obn", source: "option.source" })).toString().toLowerCase();
    //     this.id=id;
    //   } catch (error) {
    //     this.arr.push(error)
    //   }
    // })













  }
}
