import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { AppDataService, ContextMenuEventService, DbControllerService } from 'src/app/library/public-api';
import { MenuService } from '../../components/menu/menu.service';
import { DownloadOptionService } from '../../components/download-option/download-option.service';
import { LocalCachService } from '../../components/menu/local-cach.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

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
  ) {


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
        name: "更新数据", id: "updataData", click: async (list) => {
          for (let index = 0; index < list.length; index++) {
            this.DbController.delWebDbDetail(list[index].id)
            this.DbController.getDetail(list[index].id)
          }
        }
      },
      {
        name: "重置阅读进度", id: "reset_reading_progress", click: async (list) => {

          for (let index = 0; index < list.length; index++) {
            await this.resetReadingProgress(list[index].id)
          }
        }
      },
    ])

  }

  async resetReadingProgress(comics_id) {
    const detail = await this.DbController.getDetail(comics_id)
    for (let index = 0; index < detail.chapters.length; index++) {
      const x = detail.chapters[index];
      firstValueFrom(this.webDb.update("last_read_chapter_page", { 'chapter_id': x.id.toString(), "page_index": 0 }))
      if (index == 0) firstValueFrom(this.webDb.update("last_read_comics", { 'comics_id': comics_id.toString(), chapter_id: detail.chapters[index].id }))
    }
  }


}
