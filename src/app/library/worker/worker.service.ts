import { Injectable } from '@angular/core';
import { AppDataService, CacheControllerService, ImageService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  _data = {};

  worker = null
  constructor(
    public App: AppDataService,
    private webCh: CacheControllerService,
    public Image: ImageService

  ) {
    if (false) {
      this.worker = new Worker(new URL('./app.worker', import.meta.url));
      this.worker.onmessage = async ({ data }) => {
        if (data.type == "UrlToBolbUrl") {
          this._data[data.id] = data;
        } else if (data.type == "init") {
          this.App.is_web_worker = true;
        } else if (data.type == "load_image") {
          const url = await this.Image.getImageToLocalUrl(data.data);
          this._data[data.id] = { id: data.id, data: url };
        }
      };
    }


  }


  async UrlToBolbUrl(url): Promise<string> {
    const get = (url): Promise<string> => {
      const id = Math.round(Math.random() * 1000000000000);
      this.worker.postMessage({ id, type: "UrlToBolbUrl", data: url })
      let bool = true;
      return new Promise((r, j) => {
        const getData = () => {
          setTimeout(() => {
            if (this._data[id]) {
              let url = this._data[id].data;
              r(url)
            } else {
              if (bool) getData()
            }
          }, 33)
        }
        getData()
        setTimeout(() => {
          bool = false;
          r("")
          j("")
        }, 3000)
      })
    }

    const id = this.Image.utf8_to_b64(url);
    if (this.Image._data[id]) {
      url = this.Image._data[id]
      return url
    }
    const burl = await get(url)
    this.Image._data[id] = burl;
    return burl
  }

  async init() {
    const res = await this.UrlToBolbUrl('http://localhost:7700/bilibili/comics/26574');
  }

  workerImageCompression(urls, width, quality) {
    return new Promise(async (resolve, reject) => {
      const res=await Promise.all(urls.map(x => `${x}?width=${width}&quality=${quality}`).map(x=>this.webCh.match('image',x)) )

      if(res){
        let num=0;
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if(element) num++;
        }
        if(num==urls.length)  resolve(urls.map(x => `${x}?width=${width}&quality=${quality}`))
      }

      function chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
      }


      let max = navigator.hardwareConcurrency * 2;
      let num = 0;
      for (let index = 0; index < max; index++) {
        const worker = new Worker(new URL('./app.worker', import.meta.url));
        worker.postMessage({ type: "compress_multiple", data: chunkArray(urls, Math.ceil(urls.length / max))[index],width,quality })
        worker.onmessage = async ({ data }) => {
          if (data.type == "destroy") {
            num++
            worker.terminate();
            if (num == max) {
              resolve(urls.map(x => `${x}?width=${width}&quality=${quality}`))
            }
          }
        };
      }
    })

  }
}
