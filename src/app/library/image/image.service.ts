import { Injectable } from '@angular/core';
import { DbControllerService, MessageFetchService } from '../public-api';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  _data: any = {};
  constructor(public _http: MessageFetchService, public DbController: DbControllerService, private sanitizer: DomSanitizer) {
    this.del();
  }


  del() {
    setTimeout(() => {
      const nodes: any = document.querySelectorAll("app-image img");
      let arr = [];
      for (let index = 0; index < nodes.length; index++) {
        arr.push(nodes[index].src)
      }
      Object.keys(this._data).forEach(id => {
        if (!this._data[id] && this._data.changingThisBreaksApplicationSecurity) {
          if (arr.includes(this._data[id].changingThisBreaksApplicationSecurity)) {
          } else {
            URL.revokeObjectURL(this._data[id])
            this._data[id] = undefined;
          }
        }

      })
      this.del();
    }, 10000)
  }


  private async getImageBlobUrl(src: string) {
    let url;
    const id = this.utf8_to_b64(src);
    if (this._data[id]) {
      url = this._data[id]
      return url
    }
    const blob = await this.getImageBlob(src);
    url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this._data[id] = url;
    return url
  }

   utf8_to_b64 = (str: string) => {
    return window.btoa(encodeURIComponent(str));
  }
   b64_to_utf8 = (str: string) => {
    return decodeURIComponent(window.atob(str));
  }
  delBlobUrl(src: string, url: string) {
    URL.revokeObjectURL(url);
    const id = this.utf8_to_b64(src);
    if (this._data[id]) {
      delete this._data[id]
    }
  }



  async getImageBlob(src) {
    if (src.substring(0, 10) == "data:image") {
      return this.base64ToBlob(src)
    }
    const blob = await this.DbController.getImage(src);
    return blob
  }
  base64ToBlob(base64Data) {
    let arr = base64Data.split(','),
      fileType = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      l = bstr.length,
      u8Arr = new Uint8Array(l);

    while (l--) {
      u8Arr[l] = bstr.charCodeAt(l);
    }
    return new Blob([u8Arr], {
      type: fileType
    });
  }
  async getImageBase64(src) {
    if (!src) return ""
    if (src.substring(0, 10) == "data:image") {
      return src
    }
    let blob: any;
    blob = await this.getImageBlob(src);
    return new Promise((r, j) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        r(reader.result as string)
      };
      reader.onerror = () => {
        j("")
      }
    })
  }

  tasks = []; // 存储所有要执行的任务
  concurrent = 0; // 当前正在执行的任务数量
  maxConcurrent = 20; // 最大并发数量

  // 添加任务到队列中
  addTask(task) {
    this.tasks.push(task);
    this.processTasks();
  }

  // 处理任务队列
  processTasks() {
    while (this.concurrent < this.maxConcurrent && this.tasks.length > 0) {
      const task = this.tasks.shift(); // 从队列中取出一个任务
      task()
        .then(() => {
          this.concurrent--; // 任务完成，减少并发计数
          this.processTasks(); // 继续处理下一个任务
        })
        .catch(error => {
          console.error(error); // 处理任务失败
          this.concurrent--; // 任务完成，减少并发计数
          this.processTasks(); // 继续处理下一个任务
        });
      this.concurrent++; // 增加并发计数
    }
  }



  async getImageToLocalUrl(src: string) {
    let url = await this.getImageBlobUrl(src);
    return url
  }

}
