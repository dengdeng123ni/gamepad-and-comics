import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { AppDataService, ContextMenuEventService, DbControllerService, IndexdbControllerService, LocalCachService, NotifyService } from 'src/app/library/public-api';
import { MenuService } from '../../components/menu/menu.service';
import { DownloadOptionService } from '../../components/download-option/download-option.service';


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
    public webDb: IndexdbControllerService,
    public Notify:NotifyService,
    public router: Router,
    public ImageTo: ImageToService,
    private _snackBar: MatSnackBar,
  ) {
    // this.ImageTo.open();

    GamepadEvent.registerConfig("list", { region: ["comics_item", "comics_option", "menu_item", 'input', "menu_input", 'settings', 'novels_item', "context_menu_edit_item","chip_option","advanced_search_item","advanced_search_input","advanced_search_slider","advanced_search_restart"] })
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
          name: "下载", id: "download",

          click: async (list) => {
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
    if (x.is_cache) {
      this.ContextMenuEvent.registerMenu('comics_item', [
        {
          name: "数据", id: "data", submenu: [
            {
              name: "重置阅读进度", id: "reset_reading_progress", click: async (list) => {

                for (let index = 0; index < list.length; index++) {
                  await this.resetReadingProgress(list[index].id)
                  this.Notify.messageBox(`${list[index].title}`, '已完成', { duration: 1000 })
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
                  this.Notify.messageBox(`${list[index].title}`, '已完成', { duration: 1000 })
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
                      this.Notify.messageBox(`${res.chapters[index].title} ${index2 + 1}/${pages.length}`, '已完成')
                    }
                    this.Notify.messageBox(`${list[index].title} ${res.chapters[index].title}`, '已完成')
                  }
                  this.Notify.messageBox(`${list[index].title}`, '已完成', { duration: 1000 })
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
                  this.Notify.messageBox(`${list[index].title}`, '已完成', { duration: 1000 })
                }
              }
            },
            {
              name: "JSON", id: "json", click: async (list) => {
                for (let index = 0; index < list.length; index++) {

                  let res = await this.DbController.getDetail(list[index].id)
                  for (let index = 0; index < res.chapters.length; index++) {
                    const chapter_id = res.chapters[index].id;
                    const pages = await this.DbController.getPages(chapter_id)
                    res.chapters[index].pages=pages
                  }
                  const jsonString = JSON.stringify(res, null, 2); // 格式化 JSON
                  const blob = new Blob([jsonString], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${list[index].title}_web.json`; // 指定下载的文件名
                  a.click();
                  URL.revokeObjectURL(url); // 释放 URL
                }
                for (let index = 0; index < list.length; index++) {
                  let res:any = (await this.webDb.getByKey('details',list[index].id) as any).data
                  for (let index = 0; index < res.chapters.length; index++) {
                    const chapter_id = res.chapters[index].id;
                    const pages = (await this.webDb.getByKey('pages',chapter_id) as any).data
                    res.chapters[index].pages=pages
                  }
                  const jsonString = JSON.stringify(res, null, 2); // 格式化 JSON
                  const blob = new Blob([jsonString], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${list[index].title}.json`; // 指定下载的文件名
                  a.click();
                  URL.revokeObjectURL(url); // 释放 URL
                }
              }
            },
          ]
        }
      ])
    } else {
      this.ContextMenuEvent.logoutMenu('comics_item', 'data')

    }


    if (x.id == "local_cache") {
      this.ContextMenuEvent.registerMenu('comics_item', [{
        name: "删除", id: "delete", click: async (list) => {

          for (let index = 0; index < list.length; index++) {
            let node = document.querySelector(`[_id='${list[index].id}']`)
            if (node) node.remove();
            await this.delCache(list[index].id)
          }
        }
      }])
    } else if (x.id == "temporary_data") {
      this.ContextMenuEvent.registerMenu('comics_item', [{
        name: "删除", id: "delete", click: async (list) => {

          for (let index = 0; index < list.length; index++) {
            let node = document.querySelector(`[_id='${list[index].id}']`)
            if (node) node.remove();
            await this.delCache2(list[index].id)
          }
        }
      }])
    } else {
      this.ContextMenuEvent.logoutMenu('comics_item', 'delete')
    }
    if (!x.is_cache) this.ContextMenuEvent.logoutMenu('chapters_item', 'data')


  }

  data() {

  }

  async resetReadingProgress(comics_id) {
    const detail = await this.DbController.getDetail(comics_id)
    for (let index = 0; index < detail.chapters.length; index++) {
      const x = detail.chapters[index];
      this.webDb.update("last_read_chapter_page", { 'chapter_id': x.id.toString(), "page_index": 0 })
      if (index == 0) this.webDb.update("last_read_comics", { 'comics_id': comics_id.toString(), chapter_id: detail.chapters[index].id })
    }
  }

  async delCache(comics_id) {
    await this.webDb.deleteByKey('history', comics_id.toString())
    await this.webDb.deleteByKey('local_comics', comics_id)
    await this.webDb.deleteByKey('local_comics', comics_id.toString())
    this.DbController.delComicsAllImages(comics_id)
  }

  async delCache2(comics_id) {
    await this.webDb.deleteByKey('history', comics_id.toString())
    await this.webDb.deleteByKey('temporary_details', comics_id)
    await this.webDb.deleteByKey('temporary_details', comics_id.toString())
    this.DbController.delComicsAllImages(comics_id)
  }


}
