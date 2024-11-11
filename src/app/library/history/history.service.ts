import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { AppDataService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(public webDb: NgxIndexedDBService, public AppData: AppDataService) { }


  async update(obj: {
    id: string,
    title: string,
    cover: string,
  }) {
    if(!obj.cover) return
    const res: any = await firstValueFrom(this.webDb.getByID("history", obj.id))
    if (res) {
      await firstValueFrom(this.webDb.update("history", { ...res,...obj,last_read_date: new Date().getTime() }))
    } else {
      await firstValueFrom(this.webDb.update("history", { ...obj, first_read_data: new Date().getTime(), source: this.AppData.source, last_read_date: new Date().getTime() }))
    }

  }

  async update_progress(id: string, subTitle: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("history", id))
    await firstValueFrom(this.webDb.update("history", { ...res, subTitle: subTitle }))
  }


  async getAll() {
    const list = await firstValueFrom(this.webDb.getAll("history"));
    list.forEach((x: any) => {
      if (!x.subTitle) x.subTitle = "未阅读";
    })
    return list
  }

}
