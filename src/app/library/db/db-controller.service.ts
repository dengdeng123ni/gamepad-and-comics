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
    origin: string,
    is_cache?: boolean,
  }): Promise<Array<Item>> {
    if (!option.is_cache) option.is_cache = true;
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    const id = window.btoa(encodeURIComponent(JSON.stringify(obj)))
    if (this.lists[id]) {
      return JSON.parse(JSON.stringify(this.lists[id]))
    } else {
      let res;

      if (false) {
        const obj1 = await firstValueFrom(this.webDb.getByID('list', id)) as any;
        if (obj1) {
          res = obj1.data;
        } else {
          const data = await this.DbEvent.Events[option.origin]["getList"](obj);
          firstValueFrom(this.webDb.update('list', JSON.parse(JSON.stringify({
            id: id,
            data: data,
            create_time: new Date().getTime()
          }))))
          res = data;
        }
        res.forEach(x => {
          this.image_url[`${config.id}_comics_${x.id}`] = x.cover;
          x.cover = `http://localhost:7700/${config.id}/comics/${x.id}`;
          x.option = { origin: option.origin }
        })
      } else {
        const data = await this.DbEvent.Events[option.origin]["getList"](obj);
        res = data;
      }


      this.lists[id] = JSON.parse(JSON.stringify(res));
      return res
    }
  }
  async getDetail(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]

    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["getDetail"]) {
      if (this.details[id]) {
        return JSON.parse(JSON.stringify(this.details[id]))
      } else {
        let res;
        if (config.is_cache) {
          res = await firstValueFrom(this.webDb.getByID('details', id))
          if (res) {
            res = res.data;
            if (res?.cover?.substring(0, 4) == "http") this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
            if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;
            res.chapters.forEach(x => {
              if (x?.cover?.substring(0, 4) == "http") this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
              if (x.cover && x.cover.substring(7, 21) != "localhost:7700") x.cover = `http://localhost:7700/${config.id}/chapter/${res.id}/${x.id}`;
            })
          } else {
            res = await this.DbEvent.Events[option.origin]["getDetail"](id);
            firstValueFrom(this.webDb.update('details', JSON.parse(JSON.stringify({ id: id, data: res }))))
            this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
            if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;
            res.chapters.forEach(x => {
              this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
              if (x.cover && x.cover.substring(7, 21) != "localhost:7700") x.cover = `http://localhost:7700/${config.id}/chapter/${res.id}/${x.id}`;
            })
          }
        } else {
          res = await this.DbEvent.Events[option.origin]["getDetail"](id);
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
  async delWebDbDetail(id) {
    this.details[id] = null;
    await firstValueFrom(this.webDb.deleteByKey('details', id))
  }
  async Unlock(id, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Unlock"]) {
      return await this.DbEvent.Events[option.origin]["Unlock"](id);
    } else {
      return false
    }
  }
  async putWebDbDetail(id, res) {
    this.details[id] = null;
    firstValueFrom(this.webDb.update('details', JSON.parse(JSON.stringify({ id: id, data: res }))))
  }
  async delWebDbPages(id) {
    this.pages[id] = null;
    await firstValueFrom(this.webDb.deleteByKey('pages', id))
  }
  async putWebDbPages(id, pages) {
    this.pages[id] = null;
    await firstValueFrom(this.webDb.update('pages', { id, data: JSON.parse(JSON.stringify(pages)) }))
  }
  load = {};
  async loadPages(id, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    if(!config.is_preloading) return
    if (this.load[id]) {

    } else {
      this.load[id] = id;
      const pages = await this.getPages(id);
      for (let index = 0; index < pages.length; index++) {
        const res = await caches.match(pages[index].src);
        if(!res){
           this.tasks.unshift(this.getImage(pages[index].src))

        }else{
          console.log(res);

        }
      }
      this.processTasks();
    }
  }
  tasks = []; // 存储所有要执行的任务
  concurrent = 0; // 当前正在执行的任务数量
  maxConcurrent = 1; // 最大并发数量
  processTasks() {
    while (this.concurrent < this.maxConcurrent && this.tasks.length > 0) {
      const task = this.tasks.shift(); // 从队列中取出一个任务
      task()
        .then(() => {
          this.concurrent--; // 任务完成，减少并发计数
          this.processTasks(); // 继续处理下一个任务
        })
        .catch(error => {
          this.concurrent--; // 任务完成，减少并发计数
          this.processTasks(); // 继续处理下一个任务
        });
      this.concurrent++; // 增加并发计数
    }
  }
  async addImage(url, blob) {
    const response = new Response(blob);
    const request = new Request(url);
    await this.caches.put(request, response);
  }

  async delWebDbImage(id) {
    const res = await this.caches.delete(id);
  }
  async getPages(id: string, option?: {
    origin: string
  }) {

    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]

    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["getPages"]) {
      // const is_wait = await this.waitForRepetition(id)
      if (this.pages[id]) {
        return JSON.parse(JSON.stringify(this.pages[id]))
      } else {
        let res;
        if (config.is_cache) {
          res = (await firstValueFrom(this.webDb.getByID('pages', id)) as any)
          if (res) {
            res = res.data;

            res.forEach((x, i) => {
              if (x.src.substring(7, 21) == "localhost:7700") {
              } else {
                if (x.src.substring(0, 4) == "http") this.image_url[`${config.id}_page_${id}_${i}`] = x.src;
                if (x.src && x.src.substring(7, 21) != "localhost:7700") x.src = `http://localhost:7700/${config.id}/page/${id}/${i}`;
              }
            })
          } else {
            res = await this.DbEvent.Events[option.origin]["getPages"](id);
            firstValueFrom(this.webDb.update('pages', { id, data: JSON.parse(JSON.stringify(res)) }))
            res.forEach((x, i) => {
              this.image_url[`${config.id}_page_${id}_${i}`] = x.src;
              if (x.src && x.src.substring(7, 21) != "localhost:7700") x.src = `http://localhost:7700/${config.id}/page/${id}/${i}`;
            })
          }
        } else {
          res = await this.DbEvent.Events[option.origin]["getPages"](id);
        }
        res.forEach((x, i) => {
          if (!x.id) x.id = `${id}_${i}`;
          if (!x.uid) x.uid = `${id}_${i}`;
          x.index = i;
        })
        this.pages[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async delComicsAllImages(comics_id) {
    const c = await this.getDetail(comics_id)
    const origin = this.AppData.origin;
    let list = [];
    list.push(`http://localhost:7700/${origin}/comics/${comics_id}`)
    for (let index = 0; index < c.chapters.length; index++) {
      const x = c.chapters[index];
      list.push(`http://localhost:7700/${origin}/chapter/${comics_id}/${x.id}`)
      let res = (await firstValueFrom(this.webDb.getByID('pages', x.id)) as any)
      if (res) {
        res = res.data;
        res.forEach((x, i) => {
          list.push(`http://localhost:7700/${origin}/page/${x.id}/${index}`)
        })
        this.delWebDbPages(x.id)
      }
    }
    this.delWebDbDetail(comics_id)
    list.forEach(x => {
      this.delWebDbImage(x)
    })
  }
  isConditionMet = false;
  async waitForCondition(): Promise<boolean> {
    if (!this.isConditionMet) {

      return true
    }
    return new Promise((r, j) => {
      const get = () => {
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
    let blob = new Blob([], {
      type: 'image/jpeg'
    });
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["getImage"]) {
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

                let resc = await this.DbEvent.Events[option.origin]["getPages"](chapter_id);
                resc.forEach((x, i) => {
                  this.image_url[`${name}_page_${chapter_id}_${i}`] = x.src;
                })
                this.isConditionMet = false;
                return this.image_url[`${name}_page_${chapter_id}_${index}`];
              }
            } else if (type == "comics") {
              const comics_id = arr[5];
              const url = this.image_url[`${name}_comics_${comics_id}`];
              if (url) {
                return url
              } else {
                await this.waitForCondition()
                let res = await this.DbEvent.Events[option.origin]["getDetail"](comics_id);
                this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet = false;
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
                let res = await this.DbEvent.Events[option.origin]["getDetail"](comics_id);
                this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
                res.chapters.forEach(x => {
                  this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                })
                this.isConditionMet = false;
                return this.image_url[`${name}_chapter_${comics_id}_${chapter_id}`];
              }
            } else {
              return ""
            }

          }

          const id1 = await getImageURL(url);

          const blob = await this.DbEvent.Events[option.origin]["getImage"](id1)
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
          blob = await res.blob()
          if (blob.size < 1000) {
            blob = await getBlob()
          }
        } else {
          blob = await getBlob()
        }
      } else {
        blob = await this.DbEvent.Events[option.origin]["getImage"](id)
      }

      return blob
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
        this.image_url[`${config.id}_comics_${x.id}`] = x.cover;
        x.cover = `http://localhost:7700/${config.id}/comics/${x.id}`;
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
