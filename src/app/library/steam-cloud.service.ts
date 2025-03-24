import { Injectable } from '@angular/core';
import { DbComicsControllerService, DbComicsEventService } from './public-api';

@Injectable({
  providedIn: 'root'
})
export class SteamCloudService {
  data = {
    details: [],
    pages: []
  }
  constructor(public DbComicsEvent: DbComicsEventService,
    public DbComicsController: DbComicsControllerService

  ) {
    DbComicsEvent.comics_register({
      id: "steam_cloud",
      name: "Steam云",
      is_visible: false,
      is_download: true,
      is_cache: true
    }, {
      getList: async (obj: any) => {

      },
      getDetail: async (id: string) => {

      },
      getPages: async (id: string) => {

      },
      getImage: async (_id: string) => {

      }
    });
  }


  readFile(name: string) {

  }

  writeFile(name: string, content: string) {

  }

  deleteFile(name: string) {

  }

  async save(id: any, source) {

    let res = await this.DbComicsController.getDetail(id, {
      source: source,
      is_cache: true
    });
    await this.DbComicsController.getImage(res.cover)
    for (let index = 0; index < res.chapters.length; index++) {
      let x = res.chapters[index];
      await this.DbComicsController.getImage(x.cover, {
        source: source,
        is_cache: true
      })
      let pages = await this.DbComicsController.getPages(x.id, {
        source: source,
        is_cache: true
      })
      for (let index = 0; index < pages.length; index++) {
        const images = await createImageBitmap(await this.DbComicsController.getImage(pages[index].src, {
          source: source,
          is_cache: true
        }))
        pages[index].width = images.width;
        pages[index].height = images.height;
      }
      this.data.pages=this.data.pages.filter(c=>c.id==x.id)
      this.data.pages.push({ id: `${x.id}`.toString(), data: pages })
      let chapters = res.chapters.slice(0, index + 1);
      this.data.details=this.data.details.filter(c=>c.id==res.id)
      this.data.details.push(JSON.parse(JSON.stringify({ id: res.id.toString(), data: { ...res, creation_time: new Date().getTime(), chapters } })))

    }
    await this.writeFile('comics',JSON.stringify(this.data))
  }

}
