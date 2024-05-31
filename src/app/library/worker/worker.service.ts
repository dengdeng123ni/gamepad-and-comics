import { Injectable } from '@angular/core';
import { AppDataService, ImageService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  _data = {};
  worker = new Worker(new URL('./app.worker', import.meta.url));

  constructor(public App: AppDataService,
    public Image: ImageService

  ) {
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


  async UrlToBolbUrl(url): Promise<string> {
    const get = (url): Promise<string>  => {
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

}
