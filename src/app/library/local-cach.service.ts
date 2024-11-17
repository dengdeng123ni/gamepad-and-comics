import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { AppDataService, DbControllerService, DbEventService, I18nService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class LocalCachService {

  constructor(
    public DbController: DbControllerService,
    public AppData: AppDataService,
    public webDb: NgxIndexedDBService,
    private _snackBar: MatSnackBar,
    public DbEvent: DbEventService,
    public I18n: I18nService
  ) {

    DbEvent.comics_register({
      id: "local_cache",
      name: "本地缓存",
      is_download: true,
      is_cache: true
    }, {
      getList: async (obj: any) => {
        const res = await firstValueFrom(this.webDb.getAll("local_comics"))
        const list = res.map((x: any) => {
          x = x.data
          return { id: x.id, cover: x.cover, title: x.title, subTitle: `${x.chapters[0].title}` }
        }).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
        return list
      },
      getDetail: async (id: string) => {
        let res = (await firstValueFrom(this.webDb.getByID('local_comics', id.toString())) as any)
        return res.data
      },
      getPages: async (id: string) => {
        let res = (await firstValueFrom(this.webDb.getByID('local_pages', id.toString())) as any)
        return res.data
      },
      getImage: async (_id: string) => {
        const res = await caches.match(_id);
        const blob = await res.blob()
        return blob
      }
    });
  }
  private utf8_to_b64 = (str: string) => {
    return window.btoa(encodeURIComponent(str));
  }
  private b64_to_utf8 = (str: string) => {
    return decodeURIComponent(window.atob(str));
  }
  async limitPromiseAll(promises, limit) {
    const results = [];
    let currentIndex = 0;

    async function executeNext() {
      if (currentIndex >= promises.length) return;

      const currentPromiseIndex = currentIndex++;
      const currentPromise = promises[currentPromiseIndex];

      try {
        results[currentPromiseIndex] = await currentPromise();
      } catch (error) {
        results[currentPromiseIndex] = error;
      }

      await executeNext();
    }

    // 启动并发执行
    await Promise.all(Array.from({ length: limit }, executeNext));

    return results;
  }

  async save(id: any) {

    let res = await this.DbController.getDetail(id, {
      source: this.AppData.source,
      is_cache: true
    });
    res.id = `7700_${res.id}`.toString();
    await this.DbController.getImage(res.cover)
    for (let index = 0; index < res.chapters.length; index++) {
      let x = res.chapters[index];
      await this.DbController.getImage(x.cover, {
        source: this.AppData.source,
        is_cache: true
      })
      let pages = await this.DbController.getPages(x.id, {
        source: this.AppData.source,
        is_cache: true
      })
      for (let index = 0; index < pages.length; index++) {
        const images = await createImageBitmap(await this.DbController.getImage(pages[index].src, {
          source: this.AppData.source,
          is_cache: true
        }))
        pages[index].width = images.width;
        pages[index].height = images.height;
      }

      await firstValueFrom(this.webDb.update("local_pages", { id: `7700_${x.id}`.toString(), data: pages }))
      await firstValueFrom(this.webDb.update("pages", { id: `7700_${x.id}`.toString(), data: pages }))
      x.id = `7700_${x.id}`.toString();
      let chapters = res.chapters.slice(0, index + 1);
      await firstValueFrom(this.webDb.update('local_comics', JSON.parse(JSON.stringify({ id: res.id, data: { ...res, creation_time: new Date().getTime(), chapters } }))))
      await firstValueFrom(this.webDb.update('details', JSON.parse(JSON.stringify({ id: res.id, data: { ...res, creation_time: new Date().getTime(), chapters } }))))


      const 缓存完成 = await this.I18n.getTranslatedText('缓存完成')
      this._snackBar.open(`${res.title} ${x.title} ${缓存完成}`, '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
    const 缓存完成 = await this.I18n.getTranslatedText('缓存完成')
    this._snackBar.open(`${res.title} ${缓存完成}`, '', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }




}
