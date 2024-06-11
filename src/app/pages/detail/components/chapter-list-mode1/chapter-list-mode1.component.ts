import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ContextMenuEventService, DbControllerService } from 'src/app/library/public-api';
import { ExportSettingsService } from '../export-settings/export-settings.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {

    if (event.key == "Meta") this._ctrl = true;
    if (event.key == "Control") this._ctrl = true;

    return true
  }
  // selectedAll
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {

    if (event.key == "Meta") this._ctrl = false;
    if (event.key == "Control") this._ctrl = false;
    return true
  }
  constructor(public data: DataService,
    public router: Router,
    public current: CurrentService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public ContextMenuEvent: ContextMenuEventService,
    public exportSettings: ExportSettingsService,
    public DbController: DbControllerService
  ) {
    ContextMenuEvent.register('chapter_item', {
      open: () => {
        // this.close()
      },
      close: (e: any) => {

      },
      on: async (e: { value: string; id: string; }) => {

        const index = this.data.chapters.findIndex(x => x.id.toString() == e.value.toString());
        if (this.data.chapters.filter(x => x.selected).length == 0) {
          this.data.chapters[index].selected = !this.data.chapters[index].selected;
        }
        if (e.id == "delet1e") {
        } else if (e.id == "thumbnail") {
          const id = e.value
          const index = await this.current._getChapterIndex(id);
          this.doublePageThumbnail.open({
            chapter_id: id,
            page_index: index
          })

        } else if (e.id == "loading_ahead") {
          const id = e.value;
          const pages = await this.DbController.getPages(id)
          for (let index = 0; index < pages.length; index++) {
            await this.DbController.getImage(pages[index].src)

          }
        }
        else if (e.id == "export") {
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
        } else if (e.id == "reset_data") {
          const id = e.value;
          await this.DbController.delWebDbPages(id)
          const pages = await this.DbController.getPages(id)
          for (let index = 0; index < pages.length; index++) {
            await this.DbController.delWebDbImage(pages[index].src)

          }
        } else if (e.id == "retrieve_data") {
          const id = e.value;
          await this.DbController.delWebDbPages(id)

        } else if (e.id == "delete_data") {
          await this.current._delChapter(this.data.comics_id, e.value)
          const r = await this.DbController.getDetail(this.data.comics_id);
          this.data.chapters = r.chapters;
        }
      },
      menu: [
        { name: "缩略图", id: "thumbnail" },
        { name: "导出", id: "export" },
        {
          name: "数据", id: "data", submenu: [
            { name: "提前加载", id: "loading_ahead" },
            { name: "重置数据", id: "reset_data" },
            { name: "重新获取", id: "retrieve_data" },
            { name: "删除", id: "delete_data" },
          ]
        },

      ]

    })
    if (this.data.chapters[0].cover) this.pattern = 'image';
    else if (this.data.chapters[0].title) this.pattern = 'title';
    else this.pattern = 'index';

    if (this.data.chapters[0].is_locked === undefined) this.is_locked = false;
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

          } else {
            this.current.routerReader(this.data.comics_id, this.data.chapters[index].id)
          }
        }
      }

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
