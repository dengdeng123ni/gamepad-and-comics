import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


import CryptoJS from 'crypto-js'
import { CacheControllerService, IndexdbControllerService, MessageFetchService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class PulgService {


  constructor(
    private webDb: IndexdbControllerService,
    private webCh: CacheControllerService,
    public MessageFetch: MessageFetchService,
    private sanitizer: DomSanitizer) {


  }
  async load() {
    const url = document.querySelector("base").href + 'assets/js/jspdf.umd.min.js'
    const url1 = document.querySelector("base").href + 'assets/js/jszip.min.js'
    const url2 = document.querySelector("base").href + 'assets/js/pptxgen.min.js'
    let list = [url, url1, url2]
    for (let index = 0; index < list.length; index++) {
      const e = list[index];
      const c = await this.MessageFetch.cacheFetch(e)
      const blob = await c.blob();
      const url: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      this.loadJS(url.changingThisBreaksApplicationSecurity,e.split("/").at(-1))
    }
    await this.sleep(300)
  }
  async load2(e) {
    if ("browser-image-compression" == e || "图片压缩" == e) {
      const url2 = document.querySelector("base").href + 'assets/js/browser-image-compression.js'
      this.loadJS(url2,url2.split("/").at(-1))
    }
    await this.sleep(100)

  }
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  async init() {
    await this.loadAllScript();
    const js = document.querySelector("base").href + 'assets/js/swiper-bundle.min.js'
    const css = document.querySelector("base").href + 'assets/css/swiper-bundle.min.css'
    await this.loadBlobJs(js)
    await this.loadBlobCss(css)

  }

  async loadBlobJs(js) {

    const c = await this.MessageFetch.cacheFetch(js)
    const blob = await c.blob();
    const url: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this.loadJS(url.changingThisBreaksApplicationSecurity,js.split("/").at(-1))
  }

  async loadBlobCss(css) {
    const c = await this.MessageFetch.cacheFetch(css)
    const blob = await c.blob();
    const url: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this.loadCss(url.changingThisBreaksApplicationSecurity)
  }

  async loadAllAssets() {
    if (window.location.protocol == "https:") {
      const res = await this.MessageFetch.cacheFetch(document.querySelector("base").href + 'ngsw.json')
      if (!res.ok) return
      const json = await res.json();
      for (let index = 0; index < json.assetGroups.length; index++) {
        const x = json.assetGroups[index];
        for (let f = 0; f < x.urls.length; f++) {
          const c = x.urls[f];
          await this.MessageFetch.cacheFetch(document.querySelector("base").href.slice(0, -1) + c)
        }
      }
    }
  }

  async openFile() {
    const files = await (window as any).showOpenFilePicker()
    const blob = await files[0].getFile();
    const url = `http://localhost:7700/script/${blob.name}`;
    const response = new Response(blob);
    const request = url;
    await this.webCh.put('script', request, response);
    const bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this.loadJS(bloburl.changingThisBreaksApplicationSecurity,url.split("/").at(-1))
  }
  async loadBlodJs(blob,name) {
    const bloburl: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this.loadJS(bloburl.changingThisBreaksApplicationSecurity,name)
  }

  async get(url) {
    const e = await this.webCh.match('script', url)
    const blob = await e.blob()
    const url1: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    return url1.changingThisBreaksApplicationSecurity
  }
  async delete(url) {
    const list = await this.webCh.delete('script', url)
  }
  async registerScript(id: string, blob: any, option = {}) {
    // 'swiper-bundle.min'


  }
  async loadAllScript() {

    const list: any = await this.webDb.getAll('script')

    for (let index = 0; index < list.length; index++) {
      const e = list[index];
      if (e.is_enabled) {
        const res = await this.webCh.match('script', e.src);
        const blob = await res.blob();
        const url: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        this.loadJS(url.changingThisBreaksApplicationSecurity,e.name)
      }
    }


  }

  calculateBlobMD5 = async (blob) => {
    return new Promise((resolve, reject) => {
      // 使用 FileReader 读取 Blob
      const reader = new FileReader();

      // 成功读取
      reader.onload = () => {
        // 将 Blob 转换为 WordArray（CryptoJS 可处理格式）
        const wordArray = CryptoJS.lib.WordArray.create(reader.result);
        // 计算 MD5
        const md5Hash = CryptoJS.MD5(wordArray).toString();
        resolve(md5Hash);
      };

      // 读取错误
      reader.onerror = () => {
        reject("Error reading the blob.");
      };

      // 将 Blob 读取为 ArrayBuffer
      reader.readAsArrayBuffer(blob);
    });
  }

  async scriptCache(blob, name, obj = {}) {
    const response = new Response(blob);
    const id=await this.calculateBlobMD5(blob)
    const request = `http://localhost:7700/script/${id}`;
    this.webCh.put('script', request, response);
    this.webDb.update('script', {
      id: id,
      date: new Date().getTime(),
      name: name,
      is_enabled: true,
      src: request,
      ...obj
    })
  }

  loadJS(url,name) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.setAttribute('name',name);
    document.body.appendChild(script);
  }
  loadCss(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url
    document.head.appendChild(link);
  }

}
