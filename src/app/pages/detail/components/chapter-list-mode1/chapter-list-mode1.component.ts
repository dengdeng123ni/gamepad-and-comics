import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AppDataService, ContextMenuEventService, DbControllerService } from 'src/app/library/public-api';
import { ExportSettingsService } from '../export-settings/export-settings.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
import { DropDownMenuService } from '../drop-down-menu/drop-down-menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';
interface Item {
  id: string | number,
  cover: string,
  title: string,
  short_title?: string,
  pub_time?: string | Date | number,
  read?: number,
  ord?: number,
  selected?: boolean,
  like_count?: number | string,
  comments?: number | string,
  is_locked?: boolean
}
@Component({
  selector: 'app-chapter-list-mode1',
  templateUrl: './chapter-list-mode1.component.html',
  styleUrls: ['./chapter-list-mode1.component.scss']
})
export class ChapterListMode1Component {
  // abbreviated list
  _ctrl = false;

  pattern = ''
  is_locked = true;

  selected_length = 0;
  is_all = false;

  constructor(public data: DataService,
    public router: Router,
    public current: CurrentService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public ContextMenuEvent: ContextMenuEventService,
    public exportSettings: ExportSettingsService,
    public DbController: DbControllerService,
    public DropDownMenu: DropDownMenuService,
    private _snackBar: MatSnackBar,
    public AppData: AppDataService
  ) {
    if(data.is_cache&&data.is_download){
      ContextMenuEvent.register('chapter_item', {
        open: () => {
          // this.close()
        },
        close: (e: any) => {

        },
        on: async (e: any) => {

          const index = this.data.chapters.findIndex(x => x.id.toString() == e.value.toString());
          if (this.data.chapters.filter(x => x.selected).length == 0) {
            this.data.chapters[index].selected = !this.data.chapters[index].selected;
          }
          if (e.id == "thumbnail") {
            const id = e.value
            const index = await this.current._getChapterIndex(id);
            this.doublePageThumbnail.open({
              chapter_id: id
            })

          }
          if (e.id == "export") {
            const node = document.getElementById("menu_content");
            let { x, y, width, height } = node!.getBoundingClientRect();
            if (window.innerWidth < (x + 262)) x = window.innerWidth - 262
            if (window.innerHeight < (y + 212)) y = window.innerHeight - 212
            this.exportSettings.open({
              position: {
                top: `${y}px`,
                left: `${x}px`
              },
              delayFocusTrap: false,
              panelClass: "reader_settings_buttom",
              backdropClass: "reader_settings_buttom_backdrop"
            })
          } else {
            const list = this.data.chapters.filter(x => x.selected);
            (e as any).click(list)
          }
        },
        menu: [
          { name: "缩略图", id: "thumbnail" },
          { name: "下载", id: "export" },
          {
            name: "数据", id: "data", submenu: [
              {
                name: "重置数据", id: "reset_data", click: async (list) => {
                  for (let index = 0; index < list.length; index++) {
                    const chapter_id = list[index].id;
                    await this.DbController.delWebDbPages(chapter_id)
                    const pages = await this.DbController.getPages(chapter_id)
                    for (let index = 0; index < pages.length; index++) {
                      await this.DbController.delWebDbImage(pages[index].src)
                    }
                    this._snackBar.open(`重置数据已完成`, '', {
                      duration: 1000
                    })
                  }
                }
              },
              {
                name: "提前加载", id: "load", click: async (list) => {
                  for (let index = 0; index < list.length; index++) {
                    const chapter_id = list[index].id;
                    const pages = await this.DbController.getPages(chapter_id)
                    for (let ccc = 0; ccc < pages.length; ccc++) {
                      await this.DbController.getImage(pages[ccc].src)
                      this._snackBar.open(`${list[index].title} 第${ccc + 1}页/${pages.length}页`,'提前加载完成')
                    }
                    this._snackBar.open(`${list[index].title}`,'提前加载完成')
                  }
                  this._snackBar.open(`提前加载已完成`, '', {
                    duration: 1000
                  })
                }
              },
              {
                name: "重新获取", id: "reset_get", click: async (list) => {
                  for (let index = 0; index < list.length; index++) {
                    const chapter_id = list[index].id;
                    await this.DbController.delWebDbPages(chapter_id)
                    const pages = await this.DbController.getPages(chapter_id)
                  }
                  this._snackBar.open(`重新获取已完成`, '', {
                    duration: 1000
                  })
                }
              },
              {
                name: "删除", id: "delete", click: async (list) => {

                  for (let index = 0; index < list.length; index++) {
                    await this.current._delChapter(this.data.comics_id, list[index].id)
                    const r = await this.DbController.getDetail(this.data.comics_id);
                    this.data.chapters = r.chapters;
                  }
                }
              },
            ]
          },

        ]

      })
    }else if(!data.is_cache&&data.is_download){
      ContextMenuEvent.register('chapter_item', {
        open: () => {
          // this.close()
        },
        close: (e: any) => {

        },
        on: async (e: any) => {

          const index = this.data.chapters.findIndex(x => x.id.toString() == e.value.toString());
          if (this.data.chapters.filter(x => x.selected).length == 0) {
            this.data.chapters[index].selected = !this.data.chapters[index].selected;
          }
          if (e.id == "thumbnail") {
            const id = e.value
            const index = await this.current._getChapterIndex(id);
            this.doublePageThumbnail.open({
              chapter_id: id
            })

          }
          if (e.id == "export") {
            const node = document.getElementById("menu_content");
            let { x, y, width, height } = node!.getBoundingClientRect();
            if (window.innerWidth < (x + 262)) x = window.innerWidth - 262
            if (window.innerHeight < (y + 212)) y = window.innerHeight - 212
            this.exportSettings.open({
              position: {
                top: `${y}px`,
                left: `${x}px`
              },
              delayFocusTrap: false,
              panelClass: "reader_settings_buttom",
              backdropClass: "reader_settings_buttom_backdrop"
            })
          } else {
            const list = this.data.chapters.filter(x => x.selected);
            (e as any).click(list)
          }
        },
        menu: [
          { name: "缩略图", id: "thumbnail" },
          { name: "下载", id: "export" },

        ]

      })
    }else if(data.is_cache&&!data.is_download){

      ContextMenuEvent.register('chapter_item', {
        open: () => {
          // this.close()
        },
        close: (e: any) => {

        },
        on: async (e: any) => {

          const index = this.data.chapters.findIndex(x => x.id.toString() == e.value.toString());
          if (this.data.chapters.filter(x => x.selected).length == 0) {
            this.data.chapters[index].selected = !this.data.chapters[index].selected;
          }
          if (e.id == "thumbnail") {
            const id = e.value
            const index = await this.current._getChapterIndex(id);
            this.doublePageThumbnail.open({
              chapter_id: id
            })

          }
          if (e.id == "export") {
            const node = document.getElementById("menu_content");
            let { x, y, width, height } = node!.getBoundingClientRect();
            if (window.innerWidth < (x + 262)) x = window.innerWidth - 262
            if (window.innerHeight < (y + 212)) y = window.innerHeight - 212
            this.exportSettings.open({
              position: {
                top: `${y}px`,
                left: `${x}px`
              },
              delayFocusTrap: false,
              panelClass: "reader_settings_buttom",
              backdropClass: "reader_settings_buttom_backdrop"
            })
          } else {
            const list = this.data.chapters.filter(x => x.selected);
            (e as any).click(list)
          }
        },
        menu: [
          { name: "缩略图", id: "thumbnail" },
          {
            name: "数据", id: "data", submenu: [
              {
                name: "重置数据", id: "reset_data", click: async (list) => {
                  for (let index = 0; index < list.length; index++) {
                    const chapter_id = list[index].id;
                    await this.DbController.delWebDbPages(chapter_id)
                    const pages = await this.DbController.getPages(chapter_id)
                    for (let index = 0; index < pages.length; index++) {
                      await this.DbController.delWebDbImage(pages[index].src)
                    }
                    this._snackBar.open(`重置数据已完成`, '', {
                      duration: 1000
                    })
                  }
                }
              },
              {
                name: "提前加载", id: "load", click: async (list) => {
                  for (let index = 0; index < list.length; index++) {
                    const chapter_id = list[index].id;
                    const pages = await this.DbController.getPages(chapter_id)
                    for (let ccc = 0; ccc < pages.length; ccc++) {
                      await this.DbController.getImage(pages[ccc].src)
                      this._snackBar.open(`${list[index].title} 第${ccc + 1}页/${pages.length}页`,'提前加载完成')
                    }
                    this._snackBar.open(`${list[index].title}`,'提前加载完成')
                  }
                  this._snackBar.open(`提前加载已完成`, '', {
                    duration: 1000
                  })
                }
              },
              {
                name: "重新获取", id: "reset_get", click: async (list) => {
                  for (let index = 0; index < list.length; index++) {
                    const chapter_id = list[index].id;
                    await this.DbController.delWebDbPages(chapter_id)
                    const pages = await this.DbController.getPages(chapter_id)
                  }
                  this._snackBar.open(`重新获取已完成`, '', {
                    duration: 1000
                  })
                }
              },
              {
                name: "删除", id: "delete", click: async (list) => {

                  for (let index = 0; index < list.length; index++) {
                    await this.current._delChapter(this.data.comics_id, list[index].id)
                    const r = await this.DbController.getDetail(this.data.comics_id);
                    this.data.chapters = r.chapters;
                  }
                }
              },
            ]
          },

        ]

      })
    }else{
      ContextMenuEvent.register('chapter_item', {
        open: () => {
          // this.close()
        },
        close: (e: any) => {

        },
        on: async (e: any) => {

          const index = this.data.chapters.findIndex(x => x.id.toString() == e.value.toString());
          if (this.data.chapters.filter(x => x.selected).length == 0) {
            this.data.chapters[index].selected = !this.data.chapters[index].selected;
          }
          if (e.id == "thumbnail") {
            const id = e.value
            const index = await this.current._getChapterIndex(id);
            this.doublePageThumbnail.open({
              chapter_id: id
            })

          }
          if (e.id == "export") {
            const node = document.getElementById("menu_content");
            let { x, y, width, height } = node!.getBoundingClientRect();
            if (window.innerWidth < (x + 262)) x = window.innerWidth - 262
            if (window.innerHeight < (y + 212)) y = window.innerHeight - 212
            this.exportSettings.open({
              position: {
                top: `${y}px`,
                left: `${x}px`
              },
              delayFocusTrap: false,
              panelClass: "reader_settings_buttom",
              backdropClass: "reader_settings_buttom_backdrop"
            })
          } else {
            const list = this.data.chapters.filter(x => x.selected);
            (e as any).click(list)
          }
        },
        menu: [
          { name: "缩略图", id: "thumbnail" }

        ]

      })
    }

    //

    if (this.data.chapters[0].cover) this.pattern = 'image';
    else if (this.data.chapters[0].title) this.pattern = 'title';
    else this.pattern = 'index';


    if (!this.data.is_locked) this.is_locked = false;
    if (this.data.chapters[0].is_locked === undefined) this.is_locked = false;

    // data.chapters=JSON.parse(JSON.stringify(data.chapters))
  }
  updateComicsItem(x) {

  }
  async all() {
    const c = this.data.chapters.filter(x => x.selected == true).length

    if (c == this.data.chapters.length) {
      this.data.chapters.forEach(x => {
        x.selected = false
      })
    } else {
      this.data.chapters.forEach(x => {
        x.selected = true
      })
    }
    this.getIsAll();
  }

  async getIsAll() {
    const c = this.data.chapters.filter(x => x.selected == true).length
    this.selected_length = c;

    if (c == this.data.chapters.length) {
      this.is_all = true;
    } else {
      this.is_all = false;
    }


  }
  closeEdit() {
    this.data.is_edit = false;
  }
  on($event: MouseEvent) {
    const node = $event.target as HTMLElement;
    if (node.getAttribute("type") == 'list') {

    } else {
      const getTargetNode = (node: HTMLElement): HTMLElement => {
        if (node.getAttribute("region") == "chapter_item") {
          return node
        } else {
          return getTargetNode(node.parentNode as HTMLElement)
        }
      }
      const target_node = getTargetNode(node);
      const index = parseInt(target_node.getAttribute("index") as string);
      if (this.data.is_edit || this._ctrl) {
        this.data.chapters[index].selected = !this.data.chapters[index].selected;
      } else {
        if (this.data.is_locked) {
          this.current.routerReader(this.data.comics_id, this.data.chapters[index].id)
        } else {
          if (this.data.chapters[index].is_locked) {

            this.current.routerReader(this.data.comics_id, this.data.chapters[index].id)
          } else {
            this.current.routerReader(this.data.comics_id, this.data.chapters[index].id)
          }
        }
      }

    }
    this.getIsAll();
  }
  download() {
    const node = document.getElementById("download123");
    let { x, y, width, height } = node!.getBoundingClientRect();
    x = window.innerWidth - 300;
    y = window.innerHeight;
    this.exportSettings.open({
    })
  }
  async DropDownMenuOpen() {
    const e = await this.DropDownMenu.open([
      {
        name: "重置数据", id: "reset_data", click: async (list) => {
          for (let index = 0; index < list.length; index++) {
            const chapter_id = list[index].id;
            await this.DbController.delWebDbPages(chapter_id)
            const pages = await this.DbController.getPages(chapter_id)
            for (let index = 0; index < pages.length; index++) {
              await this.DbController.delWebDbImage(pages[index].src)
            }
            this._snackBar.open(`重置数据已完成`, '', {
              duration: 1000
            })
          }
        }
      },
      {
        name: "提前加载", id: "load", click: async (list) => {
          for (let index = 0; index < list.length; index++) {
            const chapter_id = list[index].id;
            const pages = await this.DbController.getPages(chapter_id)
            for (let ccc = 0; ccc < pages.length; ccc++) {
              await this.DbController.getImage(pages[ccc].src)
              this._snackBar.open(`${list[index].title} 第${ccc + 1}页/${pages.length}页`,'提前加载完成')
            }
            this._snackBar.open(`${list[index].title}`,'提前加载完成')
          }
          this._snackBar.open(`提前加载已完成`, '', {
            duration: 1000
          })
        }
      },
      {
        name: "重新获取", id: "reset_get", click: async (list) => {
          for (let index = 0; index < list.length; index++) {
            const chapter_id = list[index].id;
            await this.DbController.delWebDbPages(chapter_id)
            const pages = await this.DbController.getPages(chapter_id)
          }
          this._snackBar.open(`重新获取已完成`, '', {
            duration: 1000
          })
        }
      },
      {
        name: "删除", id: "delete", click: async (list) => {

          for (let index = 0; index < list.length; index++) {
            await this.current._delChapter(this.data.comics_id, list[index].id)
            const r = await this.DbController.getDetail(this.data.comics_id);
            this.data.chapters = r.chapters;
          }
        }
      },
    ])
    if (e) {
      const list = this.data.chapters.filter(x => x.selected);
      (e as any).click(list)
    }


  }
  close() {
    if (this.data.is_edit) return
    if (this._ctrl) return
    this.data.chapters.forEach(x => x.selected = false)
  }

  scrollNode() {
    const node = document.getElementById(`${this.data.chapter_id}`)
    if (node) {
      node!.scrollIntoView({ behavior: 'instant', block: 'center' })
      node?.focus()
    } else {
      setTimeout(() => {
        this.scrollNode()
      }, 33)
    }

  }
  ngAfterViewInit() {
    this.scrollNode();
    // const warp = document.querySelector(".detail_section")
    // warp.setAttribute('hide', 'false')


    // warp.setAttribute('hide', 'false')
  }
}
