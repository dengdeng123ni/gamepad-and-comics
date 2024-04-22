import { Injectable } from '@angular/core';
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
    public DbEvent: DbEventService
  ) {

    DbEvent.register({
      name: "local_cache",
      tab: {
        url: "",
        host_names: [],
      },
      is_edit: false,
      is_locked: false,
      is_cache: false,
      is_offprint: false,
      is_tab: false
    }, {
      List: async (obj: any) => {
        console.log(obj);

        const res = await firstValueFrom(this.webDb.getAll("local_comics"))
        const list = res.map((x: any) => {
          return { id: x.id, cover: x.cover, title: x.title, subTitle: `${x.chapters[0].title}` }
        }).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
        return list
      },
      Detail: async (id: string) => {
        let res = (await firstValueFrom(this.webDb.getByID('local_comics', id.toString())) as any)
        console.log(res);

        return res
      },
      Pages: async (id: string) => {
        let res = (await firstValueFrom(this.webDb.getByID('local_pages', id.toString())) as any)
        return res.data
      },
      Image: async (_id: string) => {
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
  async save(id: any) {
    this.DbEvent.Configs[this.AppData.origin].is_cache = true;
    let res = await this.DbController.getDetail(id);
    await this.DbController.getImage(res.cover)
    res.id=res.id.toString();
    await firstValueFrom(this.webDb.update("local_comics", res))
    await Promise.all(res.chapters.map(x=>this.DbController.getImage(x.cover)))
    for (let index = 0; index < res.chapters.length; index++) {
      const x = res.chapters[index];
      const pages = await this.DbController.getPages(x.id)
      await Promise.all(pages.map(x => this.DbController.getImage(x.src)))
      await firstValueFrom(this.webDb.update("local_pages", { id: x.id.toString(), data: pages }))
    }

  }

}
