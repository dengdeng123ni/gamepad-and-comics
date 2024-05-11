import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { AppDataService, DbControllerService, DbEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class LocalCachService {

  constructor(
    public DbController: DbControllerService,
    public AppData: AppDataService,
    public webDb: NgxIndexedDBService,
    private _snackBar: MatSnackBar,
    public DbEvent: DbEventService
  ) {

    DbEvent.register({
      id: "local_cache",
      is_download: true,
    }, {
      getList: async (obj: any) => {
        const res = await firstValueFrom(this.webDb.getAll("local_comics"))
        const list = res.map((x: any) => {
          return { id: x.id, cover: x.cover, title: x.title, subTitle: `${x.chapters[0].title}` }
        }).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
        return list
      },
      getDetail: async (id: string) => {
        let res = (await firstValueFrom(this.webDb.getByID('local_comics', id.toString())) as any)
        return res
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
  async  limitPromiseAll(promises, limit) {
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
    this.DbEvent.Configs[this.AppData.origin].is_cache = true;
    let res = await this.DbController.getDetail(id);
    await this.DbController.getImage(res.cover)
    res.id = res.id.toString();

    await this.limitPromiseAll(res.chapters.map(x => this.DbController.getImage(x.cover)),1)
    for (let index = 0; index < res.chapters.length; index++) {
      const x = res.chapters[index];
      const pages = await this.DbController.getPages(x.id)
      await this.limitPromiseAll(pages.map(x => this.DbController.getImage(x.src)),1)
      await firstValueFrom(this.webDb.update("local_pages", { id: x.id.toString(), data: pages }))
      let chapters = res.chapters.slice(0, index + 1)
      await firstValueFrom(this.webDb.update("local_comics", { ...res, chapters }))
      this._snackBar.open(`${res.title} ${x.title} 缓存完成`, '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
    this._snackBar.open(`${res.title}`, '', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

}
