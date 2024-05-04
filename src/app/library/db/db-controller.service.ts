import { Injectable } from '@angular/core';
import { AppDataService } from 'src/app/library/public-api';
import { DbEventService } from './db-event.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
interface Item { id: string | number, cover: string, title: string, subTitle: string }
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function
}

@Injectable({
  providedIn: 'root'
})
export class DbControllerService {

  lists: any = {};
  query: any = {};
  details: any = {};
  pages: any = {};

  cache = {
    details: false,
    pages: false
  }

  caches!: Cache;

  image_url = {};
  constructor(
    private AppData: AppDataService,
    private DbEvent: DbEventService,
    private webDb: NgxIndexedDBService,
  ) {
    this.init();
  }

  async init() {
    this.caches = await caches.open('image');
  }

  async getList(obj: any, option?: {
    origin: string
  }): Promise<Array<Item>> {

    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["List"]) {
      let res = await this.DbEvent.Events[option.origin]["List"](obj);
      res.forEach(x => {
        this.image_url[`${config.name}_comics_${x.id}`] = x.cover;
        x.cover = `http://localhost:7700/${config.name}/comics/${x.id}`;
      })
      res.option = { origin: option.origin }
      return res
    } else {
      return []
    }
  }
  async getDetail(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]

    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Detail"]) {
      if (this.details[id]) {
        return JSON.parse(JSON.stringify(this.details[id]))
      } else {
        if (config.is_cache) {
          let res: any = await firstValueFrom(this.webDb.getByID('details', id))

          if (res) {
            this.details[id] = JSON.parse(JSON.stringify(res));
            res.option = { origin: option.origin }
            return res
          }
        }
        let res = await this.DbEvent.Events[option.origin]["Detail"](id);
        if (config.is_cache) {
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }
          this.image_url[`${config.name}_comics_${res.id}`] = res.cover;
          res.cover = `http://localhost:7700/${config.name}/comics/${res.id}`;
          res.chapters.forEach(x => {
            this.image_url[`${config.name}_chapter_${res.id}_${x.id}`] = x.cover;
            x.cover = `http://localhost:7700/${config.name}/chapter/${res.id}/${x.id}`;
          })

          firstValueFrom(this.webDb.update('details', res))
        }
        if (!Array.isArray(res.author)) {
          res.author = [{ name: res.author }]
        }
        res.option = { origin: option.origin };
        this.details[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async getPages(id: string, option?: {
    origin: string
  }) {

    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]

    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Pages"]) {
      // const is_wait = await this.waitForRepetition(id)
      if (this.pages[id]) {
        return JSON.parse(JSON.stringify(this.pages[id]))
      } else {
        if (config.is_cache) {
          let res = (await firstValueFrom(this.webDb.getByID('pages', id)) as any)
          if (res) {
            this.pages[id] = JSON.parse(JSON.stringify(res.data));
            return res.data
          }
        }
        let res = await this.DbEvent.Events[option.origin]["Pages"](id);
        if (config.is_cache) {
          res.forEach((x, i) => {
            this.image_url[`${config.name}_page_${id}_${i}`] = x.src;
            x.src = `http://localhost:7700/${config.name}/page/${id}/${i}`;
            x.index = i;
          })
          if (res.length) {
            firstValueFrom(this.webDb.update('pages', { id: id, data: res }))
          }
        } else {
          res.forEach((x, i) => {
            x.index = i;
          })
        }
        this.pages[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  isConditionMet = false;
  async waitForCondition(): Promise<boolean> {
    if(!this.isConditionMet) {
      this.isConditionMet=true;
      return true
    }
    return new Promise((r, j) => {
      const get=()=>{
        setTimeout(() => {
          if (!this.isConditionMet) r(true)
          else get()
        }, 33)
      }

      get();
      setTimeout(() => {
        if (!this.isConditionMet) j(false)
      }, 30000)
    })
  }
  async getImage(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Image"]) {
      if (id.substring(7, 21) == "localhost:7700") {
        let url = id;
        const getBlob = async () => {

          const getImageURL = async (id: string) => {
            const arr = id.split("/")
            const name = arr[3];
            const type = arr[4];
            if (type == "page") {
              const chapter_id = arr[5];
              const index = arr[6];
              const url = this.image_url[`${name}_page_${chapter_id}_${index}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let resc = await this.DbEvent.Events[option.origin]["Pages"](chapter_id);
                resc.forEach((x, i) => {
                  this.image_url[`${name}_page_${chapter_id}_${i}`] = x.src;
                })
                this.isConditionMet=false;
                return this.image_url[`${name}_page_${chapter_id}_${index}`];
              }
            } else if (type == "comics") {
              const comics_id = arr[5];
              const url = this.image_url[`${name}_comics_${comics_id}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let res = await this.DbEvent.Events[option.origin]["Detail"](comics_id);
                this.image_url[`${config.name}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.name}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet=false;
                return this.image_url[`${name}_comics_${comics_id}`];
              }
            } else if (type == "chapter") {

              const comics_id = arr[5];
              const chapter_id = arr[6];
              const url = this.image_url[`${name}_chapter_${comics_id}_${chapter_id}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let res = await this.DbEvent.Events[option.origin]["Detail"](comics_id);
                this.image_url[`${config.name}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.name}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet=false;
                return this.image_url[`${name}_chapter_${comics_id}_${chapter_id}`];
              }
            } else {
              return ""
            }

          }

          const id1 = await getImageURL(url);
          const blob = await this.DbEvent.Events[option.origin]["Image"](id1)
          const response = new Response(blob);
          const request = new Request(url);
          await this.caches.put(request, response);
          const res2 = await caches.match(url);
          if (res2) {
            const blob2 = await res2.blob()
            return blob2
          } else {
            return blob
          }
        }
        const res = await caches.match(url);
        if (res) {
          const blob = await res.blob()
          if (blob.size < 1000) {
            return await getBlob()
          }
          return blob
        } else {
          return await getBlob()
        }
      } else {
        const res = await this.DbEvent.Events[option.origin]["Image"](id)
        return res
      }
    } else {
      return new Blob([], {
        type: 'image/jpeg'
      })
    }
  }
  async Search(obj: any, option?: {
    origin: string
  }): Promise<Array<Item>> {

    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Search"]) {
      let res = await this.DbEvent.Events[option.origin]["Search"](obj);
      res.forEach(x => {
        this.image_url[`${config.name}_comics_${x.id}`] = x.cover;
        x.cover = `http://localhost:7700/${config.name}/comics/${x.id}`;
      })
      return res
    } else {
      return []
    }
  }
  waitList = [];
  async waitForRepetition(id) {
    const obj = this.waitList.find(x => x.id == id);
    if (obj) {
      if (obj.is_loading) {
        return true
      } else {
        await this.sleep(30)
        return await this.waitForRepetition(id)
      }
    } else {
      this.waitList.push({ id: id, is_loading: false })
      return false
    }
  }
  async updateWaitList(id) {
    const index = this.waitList.findIndex(x => x.id == id);
    if (index > -1) {
      this.waitList[index].is_loading = true;
    }
  }
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
}
