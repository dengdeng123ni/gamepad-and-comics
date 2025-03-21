import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AppDataService, ContextMenuEventService, DbComicsControllerService, I18nService, IndexdbControllerService, NotifyService, PromptService, RoutingControllerService } from 'src/app/library/public-api';
import { ExportSettingsService } from '../export-settings/export-settings.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
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
    public DbComicsController: DbComicsControllerService,
    public RoutingController: RoutingControllerService,
    public Notify: NotifyService,
    private _snackBar: MatSnackBar,
    public webDb: IndexdbControllerService,
    public AppData: AppDataService,
    public Prompt: PromptService,
    public I18n: I18nService
  ) {
    //
    // 编辑
    let menu: any = [{ name: "缩略图", id: "thumbnail" },];
    if (data.is_download) {
      menu.push({ name: "下载", id: "export" },)
    } else {
      ContextMenuEvent.logoutMenu("chapters_item", "export")
    }
    if (data.is_cache) {
      menu.push({
        name: "数据", id: "data", submenu: [
          {
            name: "重置数据", id: "reset_data", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                const chapter_id = list[index].id;
                await this.DbComicsController.delWebDbPages(chapter_id)
                const pages = await this.DbComicsController.getPages(chapter_id)
                for (let index = 0; index < pages.length; index++) {
                  await this.DbComicsController.delWebDbImage(pages[index].src)
                }
                this.Notify.messageBox('已完成', '', { duration: 1000 })
              }
            }
          },
          {
            name: "提前加载", id: "load", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                const chapter_id = list[index].id;
                let pages = await this.DbComicsController.getPages(chapter_id)
                for (let i = 0; i < pages.length; i += data.images_concurrency_limit) {
                  const batch = pages.slice(i, i + data.images_concurrency_limit);
                  const pagesPromises = batch.map(x =>
                    this.DbComicsController.getImage(x.src)
                  );
                  await Promise.all(pagesPromises);
                  this.Notify.messageBox(`${list[index].title} ${i + 1}/${pages.length}`, '已完成')
                }

                this.Notify.messageBox(`${list[index].title}`, '已完成')
              }
              this.Notify.messageBox('已完成', '', {
                duration: 1000
              })
            }
          },
          {
            name: "重新获取", id: "reset_get", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                const chapter_id = list[index].id;
                await this.DbComicsController.delWebDbPages(chapter_id)
                const pages = await this.DbComicsController.getPages(chapter_id)
              }

              this.Notify.messageBox('已完成', '', {
                duration: 1000
              })
            }
          },

          {
            name: "删除", id: "delete", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                await this.current._delChapter(this.data.comics_id, list[index].id)
                const r = await this.DbComicsController.getDetail(this.data.comics_id);
                this.data.chapters = r.chapters;
              }
            }
          },
          {
            name: "JSON", id: "json", click: async (list) => {
              for (let index = 0; index < list.length; index++) {
                const res = await this.DbComicsController.getPages(list[index].id)
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
                const res = await this.webDb.getByKey('pages', list[index].id)
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


      })
      menu.push({
        name: "编辑", id: "edit", submenu: [
          {
            name: "合并章节", id: "delete1", click: async (list) => {
              let arr = [];
              for (let index = 0; index < list.length; index++) {
                const c = await this.DbComicsController.getPages(list[index].id);
                arr.push(...c)
              }
              const _id = `_${new Date().getTime()}`;
              const c = await this.DbComicsController.putWebDbPages(_id, arr);
              let detail = await this.DbComicsController.getDetail(this.data.comics_id, { source: this.current.source })
              const index = detail.chapters.findIndex(x => x.id.toString() == list[0].id.toString())
              let obj = JSON.parse(JSON.stringify(detail.chapters[index]));
              obj.id = _id;
              obj.title = `${list[0].title} - ${list.at(-1).title}`;
              detail.chapters.splice(index, 0, obj);
              for (let index = 0; index < list.length; index++) {
                detail.chapters = detail.chapters.filter(x => x.id != list[index].id)
              }
              await this.DbComicsController.putWebDbDetail(this.data.comics_id, detail);
              const r = await this.DbComicsController.getDetail(this.data.comics_id);
              this.data.chapters = r.chapters;

            }
          },
          {
            name: "重命名", id: "rename", click: async (list) => {


              for (let index = 0; index < list.length; index++) {
                console.log(list);

                const name = await this.Prompt.fire('重命名', list[index].title)
                let detail = await this.DbComicsController.getDetail(this.data.comics_id, { source: this.current.source })
                const _index = detail.chapters.findIndex(x => x.id.toString() == list[index].id.toString())
                detail.chapters[_index].title = name;
                await this.DbComicsController.putWebDbDetail(this.data.comics_id, detail);
                const r = await this.DbComicsController.getDetail(this.data.comics_id);
                this.data.chapters = r.chapters;

                const sleep = (duration) => {
                  return new Promise(resolve => {
                    setTimeout(resolve, duration);
                  })
                }
                await sleep(100)
              }
            }
          },
        ]


      })



    } else {
      ContextMenuEvent.logoutMenu("chapters_item", "data")
    }

    ContextMenuEvent.register('chapters_item', {
      open: () => {
        // this.close()
      },
      close: (e: any) => {

      },
      on: async (e: any) => {

        if (e.value) {
          const index = this.data.chapters.findIndex(x => x.id.toString() == e.value.toString());
          if (this.data.chapters.filter(x => x.selected).length == 0) {
            this.data.chapters[index].selected = !this.data.chapters[index].selected;
          }
        }
        if (e.id == "thumbnail") {
          if (e.value) {
            const id = e.value
            const index = await this.current._getChapterIndex(id);
            this.doublePageThumbnail.open({
              chapter_id: id,
              page_index: index
            })
          } else {
            const index = await this.current._getChapterIndex(this.data.chapter_id);
            this.doublePageThumbnail.open({
              chapter_id: this.data.chapter_id as any,
              page_index: index
            })
          }
        }
        if (e.id == "export") {
          if (e.value) {
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
            this.exportSettings.open({
              delayFocusTrap: false,
            })
          }

        } else {
          const list = this.data.chapters.filter(x => x.selected);
          (e as any).click(list)
        }
      },
      menu: menu
    })

    ContextMenuEvent.register('chapters_list', {
      on: async (e: any) => {
        e.click(e.PointerEvent)
      },
      menu: [
        {
          id: "back",
          name: "返回",
          click: e => {
            this.RoutingController.navigate('list')
          }
        },
        {
          id: "edit",
          name: "编辑",
          click: e => {
            this.data.is_edit = !this.data.is_edit;
          }
        }
      ]
    })
    //

    if (this.data.chapters[0].cover && this.data.chapters[0].title) {
      this.pattern = 'image';
      if (this.data.chapters[0].cover == this.data.details.cover) this.pattern = 'title';
    }
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
        if (node.getAttribute("region") == "chapters_item") {
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

  ngOnDestroy() {
    if (this.data.is_edit) this.data.is_edit = false;

  }
}
