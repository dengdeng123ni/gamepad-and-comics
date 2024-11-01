import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { AppDataService } from '../public-api';
import { DbEventService } from './db-event.service';

@Injectable({
  providedIn: 'root'
})
export class DbNovelsControllerService {

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


  async getDetail(id: string, option?: {
    source: string
  }) {
    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbEvent.Configs[option.source]

    if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["getDetail"]) {
      if (this.details[id]) {
        return JSON.parse(JSON.stringify(this.details[id]))
      } else {
        let res;
        if (config.is_cache) {
          res = await firstValueFrom(this.webDb.getByID('novels_details', id))
          if (res) {
            res = res.data;
            if (res?.cover?.substring(0, 4) == "http") this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
            if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;

          } else {
            res = await this.DbEvent.Events[option.source]["getDetail"](id);
            firstValueFrom(this.webDb.update('details', JSON.parse(JSON.stringify({ id: id,source:option.source, data: res }))))
            this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
            if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;
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
      return []
    }
  }

  async delWebDbDetail(id) {
    this.details[id] = null;
    await firstValueFrom(this.webDb.deleteByKey('novels_details', id))
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
    firstValueFrom(this.webDb.update('novels_details', JSON.parse(JSON.stringify({ id: id, data: res }))))
  }
  async delWebDbPages(id) {
    this.pages[id] = null;
    await firstValueFrom(this.webDb.deleteByKey('novels_pages', id))
  }
  async putWebDbPages(id, pages) {
    this.pages[id] = null;
    await firstValueFrom(this.webDb.update('novels_pages', { id, data: JSON.parse(JSON.stringify(pages)) }))
  }
  load = {};


  async addImage(url, blob) {
    const response = new Response(blob);
    const request = new Request(url);
    await this.caches.put(request, response);
  }

  async delWebDbImage(id) {
    const res = await this.caches.delete(id);
  }
  async getPages(id: string, option?: {
    source: string
  }) {

    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbEvent.Configs[option.source]

    if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["getPages"]) {
      // const is_wait = await this.waitForRepetition(id)
      if (this.pages[id]) {
        return JSON.parse(JSON.stringify(this.pages[id]))
      } else {
        let res;
        if (config.is_cache) {
          res = (await firstValueFrom(this.webDb.getByID('novels_pages', id)) as any)
          if (res) {
            res = res.data;

          } else {
            res = await this.DbEvent.Events[option.source]["getPages"](id);
            firstValueFrom(this.webDb.update('pages', { id,source:option.source, data: JSON.parse(JSON.stringify(res)) }))

          }
        } else {
          res = await this.DbEvent.Events[option.source]["getPages"](id);
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
    source: string
  }) {
    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbEvent.Configs[option.source]
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
          if(blob.size < 1000){
             blob = await this.DbEvent.Events[option.source]["getImage"](id1)
          }
          const response = new Response(blob);
          const request = new Request(url);
          if(blob.size > 1000) await this.caches.put(request, response);
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
        blob = await this.DbEvent.Events[option.source]["getImage"](id)
      }

      return blob
    } else {
      return new Blob([], {
        type: 'image/jpeg'
      })
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
