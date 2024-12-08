import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { AppDataService, IndexdbControllerService } from '../public-api';
import { DbEventService } from './db-event.service';

declare let window: any;
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
    private webDb: IndexdbControllerService,
  ) {
    window._gh_novels_get_detail = this.getDetail;
    window._gh_novels_get_pages = this.getPages;
  }

  getDetail = async (id: string, option?: {
    source: string
  }) => {
    if (!option) option = { source: this.AppData.source }
    if (!option.source) option.source = this.AppData.source;
    const config = this.DbEvent.Configs[option.source]

    if (this.DbEvent.Events[option.source] && this.DbEvent.Events[option.source]["getDetail"]) {
      if (this.details[id] && config.is_cache) {
        return JSON.parse(JSON.stringify(this.details[id]))
      } else {
        let res;
        if (config.is_cache) {
          res = await firstValueFrom(this.webDb.getByKey('novels_details', id))
          if (res) {
            res = res.data;
            if (res?.cover?.substring(0, 4) == "http") this.image_url[`${config.id}_comics_${res.id}`] = res.cover;
            if (res.cover && res.cover.substring(7, 21) != "localhost:7700") res.cover = `http://localhost:7700/${config.id}/comics/${res.id}`;

          } else {
            res = await this.DbEvent.Events[option.source]["getDetail"](id);
            firstValueFrom(this.webDb.update('novels_details', JSON.parse(JSON.stringify({ id: id, source: option.source, data: res }))))
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
  getPages = async (id: string, option?: {
    source: string
  }) => {
    try {
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
            res = (await firstValueFrom(this.webDb.getByKey('novels_pages', id)) as any)
            if (res) {
              res = res.data;

            } else {
              res = await this.DbEvent.Events[option.source]["getPages"](id);
              firstValueFrom(this.webDb.update('novels_pages', { id, source: option.source, data: JSON.parse(JSON.stringify(res)) }))

            }
          } else {
            res = await this.DbEvent.Events[option.source]["getPages"](id);
          }
          res.forEach((x, i) => {
            if (!x.id) x.id = `${i}`;
            if (!x.uid) x.uid = `${i}`;
            x.index = i;
          })
          this.pages[id] = JSON.parse(JSON.stringify(res));
          return res
        }
      } else {
        return []
      }
    } catch (error) {
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






  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
}
