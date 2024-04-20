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

    // DbEvent.register({
    //   name: "local_cache",
    //   tab: {
    //     url: "",
    //     host_names: [],
    //   },
    //   is_edit: true,
    //   is_locked: false,
    //   is_cache: true,
    //   is_offprint:false,
    //   is_tab: false
    // }, {
    //   List: async (obj: any) => {
    //     const res = await firstValueFrom(this.webDb.getAll("local_comics"))
    //     const list = res.map((x: any) => {
    //       return { id: this.utf8_to_b64(JSON.stringify({ id: x.id, origin: x.origin })), cover: x.cover, title: x.title, subTitle: `${x.chapters[0].title}` }
    //     }).slice((obj.page_num - 1) * obj.page_size, obj.page_size);
    //     return list
    //   },
    //   Detail: async (_id: string) => {
    //     const { id, origin } = JSON.parse(this.b64_to_utf8(_id)) as { id: string, origin: string }
    //     const res: any = await firstValueFrom(this.webDb.getAll("local_comics"))
    //     const obj = res.filter(x => id == id)[0];
    //     obj.id = this.utf8_to_b64(JSON.stringify({ id: obj.id, origin: obj.origin }))
    //     obj.chapters.forEach(x => {
    //       x.id = this.utf8_to_b64(JSON.stringify({ id: x.id, origin: obj.origin }))
    //     })
    //     return obj
    //   },
    //   Pages: async (_id: string) => {
    //     const { id, origin } = JSON.parse(this.b64_to_utf8(_id)) as { id: string, origin: string }
    //     const res = await firstValueFrom(this.webDb.getByID("local_comics", id.toString()))
    //     if (res) {
    //     } else {
    //       const res = await this.DbController.getPages(id, { origin });
    //       res.forEach(x => {
    //         x.src = `${x.src}_${this.utf8_to_b64(origin)}`
    //       })

    //       return res
    //     }
    //   },
    //   Image: async (_id: string) => {
    //     const arr = _id.split("_");
    //     const id = arr[0];
    //     const origin = this.b64_to_utf8(arr[1]);
    //     const blob = this.DbController.getImage(id,{origin});
    //     return blob

    //     // const obj = this.files.find((x: { id: string; }) => x.id == id);
    //     // const blob = await obj.blob.getFile();
    //     // return blob
    //   }
    // });
  }
  private utf8_to_b64 = (str: string) => {
    return window.btoa(encodeURIComponent(str));
  }
  private b64_to_utf8 = (str: string) => {
    return decodeURIComponent(window.atob(str));
  }
  async save(id: string) {
    const res = await this.DbController.getDetail(id);
    res.origin = this.AppData.origin;
    await firstValueFrom(this.webDb.update("local_comics", res))
  }
}
