import { Injectable } from '@angular/core';


import { AppDataService, IndexdbControllerService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(public webDb: IndexdbControllerService, public AppData: AppDataService) { }


  async update(obj: {
    id: string,
    title: string,
    cover: string,
  }) {
    if(!obj.cover) return
    const res: any = await this.webDb.getByKey("history", obj.id)
    if (res) {
      await this.webDb.update("history", { ...res, ...obj,last_read_date: new Date().getTime() })
    } else {
      await this.webDb.update("history", { ...obj, first_read_date: new Date().getTime(), source: this.AppData.source, last_read_date: new Date().getTime() })
    }

  }

  async update_progress(id: string, subTitle: string) {
    const res: any = await this.webDb.getByKey("history", id)
    await this.webDb.update("history", { ...res, subTitle: subTitle })
  }


  async getAll() {
    const list = await this.webDb.getAll("history")
    list.forEach((x: any) => {
      if (!x.subTitle) x.subTitle = "未阅读";
    })
    return list
  }

}
