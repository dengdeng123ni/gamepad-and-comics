import { Injectable } from '@angular/core';
import { DbComicsControllerService, DbComicsEventService } from './public-api';
import CryptoJS from 'crypto-js'

declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class SteamCloudService {
  data = {
    details: [],
    pages: []
  }

  _data = {

  }
  constructor(
    public DbComicsEvent: DbComicsEventService,
    public DbComicsController: DbComicsControllerService

  ) {
    DbComicsEvent.comics_register({
      id: "steam_cloud",
      name: "Steam云",
      is_visible: false,
      is_download: true,
      is_cache: false
    }, {
      getList: async (obj: any) => {

      },
      getDetail: async (id: string) => {
        const obj = this.data.details.find(x => x.id == id)
        return JSON.parse(JSON.stringify(obj.data))
      },
      getPages: async (id: string) => {
        const obj = this.data.pages.find(x => x.id == id)
        return JSON.parse(JSON.stringify(obj.data))
      },
      getImage: async (_id: string) => {
        const blob = await this.base64ToBlob(this.readFile(_id))
        return blob
      }
    });
    setTimeout(() => {
      window._gh_list_menu_register(
        {
          id: "steam_cloud",
          target: "built_in"
        },
        [
          {
            id: 'latest',
            icon: 'fiber_new',
            name: 'Steam 云',
            source: "steam_cloud",
            query: {
              type: 'single',
              name: 'Steam 云',
              click: async (e) => {
                window._gh_navigate(['/detail', "steam_cloud", e.data.id])
              }
            },
            getList: async (obj) => {
              return this.data.details.map(x => x.data);
            },
          },
        ],
      )
      this.init();
    },300)

  }
  init(){
    const data= this.readFile('comics');

    this.data=JSON.parse(data);
  }


  readFile(name: string) {

    return window._steam_cloud_readFile(name)
  }

  fileExists(name: string) {
    return window._steam_cloud_fileExists(name)
  }

  writeFile(name: string, content: string) {

    return window._steam_cloud_writeFile(name,content)
  }

  deleteFile(name: string) {
    return window._steam_cloud_deleteFile(name)
  }

  async save(id: any, source) {
    let res = await this.DbComicsController.getDetail(id, {
      source: source,
      is_cache: true
    });
    const blob = await this.DbComicsController.getImage(res.cover)
    res.cover = await this.getMd5(blob)

    res.id = `steam_cloud_${res.id}`.toString();
    for (let index = 0; index < res.chapters.length; index++) {
      let x = res.chapters[index];
      if (x.cover) {
        const blob = await this.DbComicsController.getImage(x.cover, {
          source: source,
          is_cache: true
        })
        x.cover = await this.getMd5(blob)
      }

      let pages = await this.DbComicsController.getPages(x.id, {
        source: source,
        is_cache: true
      })
      for (let index = 0; index < pages.length; index++) {
        const blob = await this.DbComicsController.getImage(pages[index].src, {
          source: source,
          is_cache: true
        });
        pages[index].src = await this.getMd5(blob)
        const images = await createImageBitmap(blob)
        pages[index].width = images.width;
        pages[index].height = images.height;
      }
      this.data.pages = this.data.pages.filter(c => c.id != `steam_cloud_${x.id}`)
      this.data.pages.push({ id: `steam_cloud_${x.id}`.toString(), data: pages })
      let chapters = res.chapters.slice(0, index + 1);
      this.data.details = this.data.details.filter(c => c.id != `${res.id}`)
      this.data.details.push(JSON.parse(JSON.stringify({ id: `${res.id.toString()}`, data: { ...res, creation_time: new Date().getTime(), chapters:chapters.map(x=>{
        return {...x,id:`steam_cloud_${x.id}`}
      }) } })))
      await this.writeFile('comics', JSON.stringify(this.data))
    }



  }


  async getMd5(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer()
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const md5Hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
    const base64 = await this.blobtoBase64(blob);

    const bool=  this.fileExists(md5Hash);
    if(!bool){
      await this.writeFile(md5Hash, base64)
    }else{
      console.log("数据已存在");
    }
    return md5Hash
  }

  async blobtoBase64(blob: Blob): Promise<string> {
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
  async base64toblob(blob: Blob): Promise<string> {
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
  base64ToBlob = (base64Data) => {
    // 提取 MIME 类型和 Base64 数据
    const [header, base64] = base64Data.split(',');
    const mimeType = header.match(/:(.*?);/)[1]; // 提取 MIME 类型

    // 解码 Base64 数据为二进制字符串
    const binaryString = window.atob(base64);

    // 将二进制字符串转换为 Uint8Array
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // 创建 Blob 并保留类型信息
    const res = new Blob([uint8Array], { type: mimeType })


    return res;
  }

}
