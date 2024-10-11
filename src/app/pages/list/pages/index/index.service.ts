import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { AppDataService, ContextMenuEventService, DbControllerService, LocalCachService } from 'src/app/library/public-api';
import { MenuService } from '../../components/menu/menu.service';
import { DownloadOptionService } from '../../components/download-option/download-option.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { ImageToService } from '../../components/image-to/image-to.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(
    public GamepadEvent: GamepadEventService,
    public ContextMenuEvent: ContextMenuEventService,
    public menu: MenuService,
    public AppData: AppDataService,
    public DownloadOption: DownloadOptionService,
    public LocalCach: LocalCachService,
    public DbController: DbControllerService,
    public webDb: NgxIndexedDBService,
    public ImageTo:ImageToService,
  ) {
    // this.ImageTo.open();

    GamepadEvent.registerConfig("list", { region: ["comics_item", "comics_option", "menu_item"] })
    GamepadEvent.registerConfig("comics_type", { region: ["comics_type_item"] })

    GamepadEvent.registerAreaEvent("menu", {
      B: () => menu.close()
    })

    AppData.origin$.subscribe((x: any) => {
      this.updateComicsItem(x)
    })
    // this.updateComicsItem(AppData.originConfig)


  }

  updateComicsItem(x) {

    if (x.is_download) {
      this.ContextMenuEvent.registerMenu('comics_item', [
        {
          name: "下载", id: "download", click: async (list) => {
            this.DownloadOption.open(list)
          }
        },
        {
          name: "缓存", id: "local_cach", click: async (list) => {
            for (let index = 0; index < list.length; index++) {
              await this.LocalCach.save(list[index].id);
            }
          }
        },
        {
          name: "图像处理", id: "image_to", click: async (list) => {
            console.log(list);

            await this.ImageTo.open(list);

          }
        },


      ])
      if (x.id == "local_cache") {
        this.ContextMenuEvent.logoutMenu('comics_item', 'local_cach')
      }
    } else {
      this.ContextMenuEvent.logoutMenu('comics_item', 'download')
      this.ContextMenuEvent.logoutMenu('comics_item', 'local_cach')
    }
    this.ContextMenuEvent.registerMenu('comics_item', [
      {
        name: "数据", id: "data", submenu: [
          {
            name: "重置阅读进度", id: "reset_reading_progress", click: async (list) => {

              for (let index = 0; index < list.length; index++) {
                await this.resetReadingProgress(list[index].id)
              }
            }
          },
          {
            name: "重置数据", id: "reset_data", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                this.DbController.delWebDbDetail(list[index].id)
                const res= await this.DbController.getDetail(list[index].id)
                for (let index = 0; index < res.chapters.length; index++) {
                 const chapter_id=res.chapters[index].id;
                 await this.DbController.delWebDbPages(chapter_id)
                 const pages = await this.DbController.getPages(chapter_id)
                 for (let index = 0; index < pages.length; index++) {
                   await this.DbController.delWebDbImage(pages[index].src)
                   await this.DbController.getImage(pages[index].src)
                 }
                }
               }
            }
          },
          {
            name: "提前加载", id: "load", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
               const res= await this.DbController.getDetail(list[index].id)
               for (let index = 0; index < res.chapters.length; index++) {
                const chapter_id=res.chapters[index].id;
                const pages = await this.DbController.getPages(chapter_id)
                for (let index = 0; index < pages.length; index++) {
                  await this.DbController.getImage(pages[index].src)
                }
               }
              }
            }
          },
          {
            name: "重新获取", id: "reset_get", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                this.DbController.delWebDbDetail(list[index].id)
                const res= await this.DbController.getDetail(list[index].id)
                for (let index = 0; index < res.chapters.length; index++) {
                 const chapter_id=res.chapters[index].id;
                 await this.DbController.delWebDbPages(chapter_id)
                 const pages = await this.DbController.getPages(chapter_id)
                }
               }
            }
          },
          {
            name: "删除", id: "delete", click: async (list) => {

              for (let index = 0; index < list.length; index++) {
                await this.delCaches(list[index].id)
              }
            }
          },
        ]
      }
    ])

  }

  data(){

  }

  async resetReadingProgress(comics_id) {
    const detail = await this.DbController.getDetail(comics_id)
    for (let index = 0; index < detail.chapters.length; index++) {
      const x = detail.chapters[index];
      firstValueFrom(this.webDb.update("last_read_chapter_page", { 'chapter_id': x.id.toString(), "page_index": 0 }))
      if (index == 0) firstValueFrom(this.webDb.update("last_read_comics", { 'comics_id': comics_id.toString(), chapter_id: detail.chapters[index].id }))
    }
  }

  async delCaches(comics_id) {
    await firstValueFrom(this.webDb.deleteByKey('history', comics_id.toString()))
    await firstValueFrom(this.webDb.deleteByKey('local_comics', comics_id))
    await firstValueFrom(this.webDb.deleteByKey('local_comics', comics_id.toString()))
    this.DbController.delComicsAllImages(comics_id)
  }


}
