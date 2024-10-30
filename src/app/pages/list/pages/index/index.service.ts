import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { AppDataService, ContextMenuEventService, DbControllerService, LocalCachService } from 'src/app/library/public-api';
import { MenuService } from '../../components/menu/menu.service';
import { DownloadOptionService } from '../../components/download-option/download-option.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { ImageToService } from '../../components/image-to/image-to.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public router: Router,
    public ImageTo: ImageToService,
    private _snackBar: MatSnackBar,
  ) {
    // this.ImageTo.open();

    GamepadEvent.registerConfig("list", { region: ["comics_item", "comics_option", "menu_item", 'input', "menu_input", 'settings'] })
    GamepadEvent.registerConfig("comics_type", { region: ["comics_type_item"] })

    GamepadEvent.registerAreaEvent("menu", {
      B: () => menu.close()
    })

    AppData.source$.subscribe((x: any) => {
      this.updateComicsItem(x)
    })
    // this.updateComicsItem(AppData.sourceConfig)


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
            await this.ImageTo.open({
              data: list
            });
          }
        },


      ])
      if (x.id == "local_cache") {
        this.ContextMenuEvent.logoutMenu('comics_item', 'local_cach')
      }
    } else {
      this.ContextMenuEvent.logoutMenu('comics_item', 'download')
      this.ContextMenuEvent.logoutMenu('comics_item', 'local_cach')
      this.ContextMenuEvent.logoutMenu('comics_item', 'image_to')
    }

    this.ContextMenuEvent.registerMenu('comics_item', [
      {
        name: "数据", id: "data", submenu: [
          {
            name: "重置阅读进度", id: "reset_reading_progress", click: async (list) => {

              for (let index = 0; index < list.length; index++) {
                await this.resetReadingProgress(list[index].id)
                this._snackBar.open(`${list[index].title}`, '重置阅读进度已完成', { duration: 1000 })
              }

            }
          },
          {
            name: "重置数据", id: "reset_data", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                this.DbController.delWebDbDetail(list[index].id)
                const res = await this.DbController.getDetail(list[index].id)
                for (let index = 0; index < res.chapters.length; index++) {
                  const chapter_id = res.chapters[index].id;
                  await this.DbController.delWebDbPages(chapter_id)
                  const pages = await this.DbController.getPages(chapter_id)
                  for (let index = 0; index < pages.length; index++) {
                    await this.DbController.delWebDbImage(pages[index].src)
                  }
                }
                this._snackBar.open(`${list[index].title}`, '重置数据已完成', { duration: 1000 })
              }
            }
          },
          {
            name: "提前加载", id: "load", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                const res = await this.DbController.getDetail(list[index].id)
                for (let index = 0; index < res.chapters.length; index++) {
                  const chapter_id = res.chapters[index].id;
                  const pages = await this.DbController.getPages(chapter_id)
                  for (let index2 = 0; index2 < pages.length; index2++) {
                    await this.DbController.getImage(pages[index2].src)
                    this._snackBar.open(`${res.chapters[index].title} 第${index2 + 1}页/${pages.length}页`, '提前加载完成')
                  }
                  this._snackBar.open(`${res.chapters[index].title}`, '提前加载完成')
                }
                this._snackBar.open(`${list[index].title}`, '提前加载已完成', { duration: 1000 })
              }
            }
          },
          {
            name: "重新获取", id: "reset_get", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                this.DbController.delWebDbDetail(list[index].id)
                const res = await this.DbController.getDetail(list[index].id)
                for (let index = 0; index < res.chapters.length; index++) {
                  const chapter_id = res.chapters[index].id;
                  await this.DbController.delWebDbPages(chapter_id)
                  const pages = await this.DbController.getPages(chapter_id)
                }
                this._snackBar.open(`${list[index].title}`, '重新获取已完成', { duration: 1000 })
              }
            }
          },
        ]
      }
    ])
    if (x.id == "local_cache") {
      this.ContextMenuEvent.registerMenu('comics_item', [{
        name: "删除", id: "delete", click: async (list) => {

          for (let index = 0; index < list.length; index++) {
            let node = document.querySelector(`[_id='${list[index].id}']`)
            if (node) node.remove();
            await this.delCaches(list[index].id)
          }
        }
      }])
    } else {
      this.ContextMenuEvent.logoutMenu('comics_item', 'delete')
    }
    if (!x.is_cache) this.ContextMenuEvent.logoutMenu('chapter_item', 'data')
  }

  data() {

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
