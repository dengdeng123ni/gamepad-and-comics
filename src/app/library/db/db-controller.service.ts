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

declare let window: any;

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
    window._gh_comics_get_list = this.getList;
    window._gh_comics_get_detail = this.getDetail;
    window._gh_comics_get_pages = this.getPages;
    window._gh_comics_get_image = this.getImage;
    window._gh_comics_search = this.Search;
  }

  async init() {
    this.caches = await caches.open('image');
  }

  getList = async (obj: any, option?: {
    source: string,
    is_cache?: boolean,
  }): Promise<Array<Item>> => {
    try {
      if (!option.is_cache) option.is_cache = true;
      if (!option.source) option.source = this.AppData.source;
      const config = this.DbEvent.Configs[option.source]
      const id = window.btoa(encodeURIComponent(JSON.stringify(obj)))
      if (this.lists[id] && config.is_cache) {
        return JSON.parse(JSON.stringify(this.lists[id]))
      } else {
        let res;

        if (config.is_cache) {
          const obj1 = await firstValueFrom(this.webDb.getByID('list', id)) as any;
          const millisecondsInOneDay = 12 * 60 * 60 * 1000;

          if (obj1 && (obj1.create_time + millisecondsInOneDay) < new Date().getTime()) {
            res = obj1.data;

          } else {
            const data = await this.DbEvent.Events[option.source]["getList"](obj);
            firstValueFrom(this.webDb.update('list', JSON.parse(JSON.stringify({
              id: id,
              data: data,
              create_time: new Date().getTime()
            }))))
            res = data;
          }

        } else {
          const data = await this.DbEvent.Events[option.source]["getList"](obj);
          res = data;
        }
        res.forEach(x => {
          this.image_url[`${config.id}_comics_${x.id}`] = x.cover;
          x.cover = `http://localhost:7700/${config.id}/comics/${x.id}`;
          x.option = { source: option.source }
        })

        this.lists[id] = JSON.parse(JSON.stringify(res));



        return res
      }
    } catch (error) {
      console.log(error);
      return []

    }

  }
  getDetail = async (id: string, option?: {
    source: string,
    is_cache?: boolean
  }) => {
    try {
      if (!option) option = { source: this.AppData.source }
      if (!option.source) option.source = this.AppData.source;
      let config = this.DbEvent.Configs[option.source]
      if (option && option.is_cache===true) config.is_cache = true
      if (option && option.is_cache===false) config.is_cache = false
      if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["getDetail"]) {
        if (this.details[id] && config.is_cache) {
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
                if (!x.cover) x.cover = res.cover;
              })
            } else {
              res = await this.DbEvent.Events[option.source]["getDetail"](id);
              firstValueFrom(this.webDb.update('details', JSON.parse(JSON.stringify({ id: id, source: option.source, data: res }))))
              this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
              if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;
              res.chapters.forEach(x => {
                this.image_url[`${config.id}_chapter_${res.id}_${x.id}`] = x.cover;
                if (x.cover && x.cover.substring(7, 21) != "localhost:7700") x.cover = `http://localhost:7700/${config.id}/chapter/${res.id}/${x.id}`;
                if (!x.cover) x.cover = res.cover;
              })
            }
          } else {
            res = await this.DbEvent.Events[option.source]["getDetail"](id);
          }

          if (!Array.isArray(res.author)) {
            res.author = [{ name: res.author }]
          }
          res.option = { source: option.source };
          this.details[id] = JSON.parse(JSON.stringify(res));

          return res
        }
      } else {
        return null
      }
    } catch (error) {
      console.log(error);
      return null
    }

  }
  getPages = async (id: string, option?: {
    source: string,
    is_cache?: boolean
  }) => {
    try {
      if (!option) option = { source: this.AppData.source }
      if (!option.source) option.source = this.AppData.source;
      let config = this.DbEvent.Configs[option.source]
      if (option && option.is_cache===true) config.is_cache = true
      if (option && option.is_cache===false) config.is_cache = false
      if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["getPages"]) {
        // const is_wait = await this.waitForRepetition(id)
        if (this.pages[id]) {
          return JSON.parse(JSON.stringify(this.pages[id]))
        } else {
          let res;
          if (config.is_cache) {
            res = (await firstValueFrom(this.webDb.getByID('pages', id)) as any)
            if (res) {
              console.log(JSON.parse(JSON.stringify(res)));
              res = res.data;

              res.forEach((x, i) => {
                if (x.src.substring(7, 21) == "localhost:7700") {
                } else {
                  if (x.src.substring(0, 4) == "http") this.image_url[`${config.id}_page_${id}_${i}`] = x.src;
                  if (x.src && x.src.substring(7, 21) != "localhost:7700") x.src = `http://localhost:7700/${config.id}/page/${id}/${i}`;
                }
              })
            } else {
              res = await this.DbEvent.Events[option.source]["getPages"](id);
              if (typeof res[0] === 'string') {
                let arr = res;
                let data = [];
                for (let index = 0; index < arr.length; index++) {
                  let obj = {
                    id: "",
                    src: ""
                  };
                  obj["id"] = `${index}`;
                  obj["src"] = `${arr[index]}`
                  data.push(obj)
                }
                res = data;
              }
              console.log(res);

              await firstValueFrom(this.webDb.update('pages', { id, source: option.source, data: JSON.parse(JSON.stringify(res)) }))
              res.forEach((x, i) => {
                this.image_url[`${config.id}_page_${id}_${i}`] = x.src;
                if (x.src && x.src.substring(7, 21) != "localhost:7700") x.src = `http://localhost:7700/${config.id}/page/${id}/${i}`;
              })
            }
          } else {
            res = await this.DbEvent.Events[option.source]["getPages"](id);
            if (typeof res[0] === 'string') {
              let arr = res;
              let data = [];
              for (let index = 0; index < arr.length; index++) {
                let obj = {
                  id: "",
                  src: ""
                };
                obj["id"] = `${index}`;
                obj["src"] = `${arr[index]}`
                data.push(obj)
              }
              res = data;
            }
          }
          res.forEach((x, i) => {
            if (!x.id) x.id = `${id}_${i}`;
            if (!x.uid) x.uid = `${id}_${i}`;
            if (!x.width) x.width = 0;
            if (!x.height) x.height = 0;
            x.index = i;
          })
          this.pages[id] = JSON.parse(JSON.stringify(res));
          return res
        }
      } else {
        return []
      }
    } catch (error) {
      console.log(error);
      return []
    }

  }
  getImage = async (id: string, option?: {
    source: string,
    is_cache?: boolean
  }): Promise<Blob> => {
    try {
      if (!option) option = { source: this.AppData.source }
      if (!option.source) option.source = this.AppData.source;
      let config = this.DbEvent.Configs[option.source]
      if (option && option.is_cache) config.is_cache = true
      let blob = new Blob([], {
        type: 'image/jpeg'
      });

      if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["getImage"]) {
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

                  let resc = await this.DbEvent.Events[option.source]["getPages"](chapter_id);
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
                  let res = await this.DbEvent.Events[option.source]["getDetail"](comics_id);
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
                  let res = await this.DbEvent.Events[option.source]["getDetail"](comics_id);
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
            let blob = await this.DbEvent.Events[option.source]["getImage"](id1)

            if (blob.size < 5000 && blob.type.split("/")[0] == "image") {
              blob = await this.DbEvent.Events[option.source]["getImage"](id1)
            }

            const response = new Response(blob);
            const request = new Request(url);

            if (blob.size > 5000 && blob.type.split("/")[0] == "image") await this.caches.put(request, response);
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


            if (blob.size < 5000 && blob.type.split("/")[0] == "image") {
              blob = await getBlob()
            }
          } else {
            blob = await getBlob()
          }
        } else {
          blob = await this.DbEvent.Events[option.source]["getImage"](id)
        }
        return blob
      } else {
        return new Blob([], {
          type: 'image/jpeg'
        })
      }
    } catch (error) {
      return new Blob([], {
        type: 'image/jpeg'
      })
    }
  }
  Search = async (obj: any, option?: {
    source: string
  }): Promise<Array<Item>> => {

    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbEvent.Configs[option.source]
    if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["Search"]) {
      let res = await this.DbEvent.Events[option.source]["Search"](obj);
      res.forEach(x => {
        this.image_url[`${config.id}_comics_${x.id}`] = x.cover;
        x.cover = `http://localhost:7700/${config.id}/comics/${x.id}`;
      })
      return res
    } else {
      return []
    }
  }
  UrlToDetailId = async (url: any, option?: {
    source: string
  }) => {
    let res = await this.DbEvent.Events[option.source]["UrlToDetailId"](url);
    return res
  }
  async delWebDbDetail(id) {
    this.details[id] = null;
    await firstValueFrom(this.webDb.deleteByKey('details', id))
  }
  async Unlock(id, option?: {
    source: string
  }) {
    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["Unlock"]) {
      return await this.DbEvent.Events[option.source]["Unlock"](id);
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
    source: string
  }) {
    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbEvent.Configs[option.source];
    if (!config.is_preloading || !config.is_cache) return

    if (this.load[id]) {

    } else {
      this.load[id] = id;
      const pages = await this.getPages(id);
      for (let index = (pages.length - 1); 0 <= index; index--) {
        const res = await caches.match(pages[index].src);
        if (!res) {
          this.tasks.unshift({ id: pages[index].src, option })
        } else {

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
      this.getImage(task.id, task.option)
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

  async delComicsAllImages(comics_id) {
    const c = await this.getDetail(comics_id)
    const source = this.AppData.source;
    let list = [];
    list.push(`http://localhost:7700/${source}/comics/${comics_id}`)
    for (let index = 0; index < c.chapters.length; index++) {
      const x = c.chapters[index];
      list.push(`http://localhost:7700/${source}/chapter/${comics_id}/${x.id}`)
      let res = (await firstValueFrom(this.webDb.getByID('pages', x.id)) as any)
      if (res) {
        res = res.data;
        res.forEach((x, i) => {
          list.push(`http://localhost:7700/${source}/page/${x.id}/${index}`)
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
