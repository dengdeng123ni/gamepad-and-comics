import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoublePageThumbnailService } from './double-page-thumbnail.service';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { ContextMenuEventService, UtilsService } from 'src/app/library/public-api';
interface DialogData {
  chapter_id: string;
  page_index: number
}
@Component({
  selector: 'app-double-page-thumbnail',
  templateUrl: './double-page-thumbnail.component.html',
  styleUrls: ['./double-page-thumbnail.component.scss']
})
export class DoublePageThumbnailComponent {

  pages: any = [];
  page_index = 0;
  chapter_id = [];

  double_pages: any = [];

  constructor(
    public utils: UtilsService,
    private zone: NgZone,
    public data: DataService,
    public current: CurrentService,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData,
    public doublePageThumbnail: DoublePageThumbnailService,
    public ContextMenuEvent: ContextMenuEventService
  ) {
    this.init(_data);
    ContextMenuEvent.register('double_page_thumbnail_item', {
      send: ($event, data) => {
        let index_arr = [];
        $event.querySelectorAll(".index").forEach(node => {
          index_arr.push(parseInt(node.textContent))
        })
        index_arr.sort();
        const delete_index = data.findIndex(x => x.id == "delete");
        data[delete_index].submenu = index_arr.map(x => ({ name: x, id: `delete`, data: x }));

        const insertPage_index = data.findIndex(x => x.id == "insertPage");
        data[insertPage_index].submenu = [];
        index_arr.forEach(x => {
          data[insertPage_index].submenu.push({ name: `${x}页之前插入`, id: `insertPageBefore`, data: x })
          data[insertPage_index].submenu.push({ name: `${x}页之后插入`, id: `insertPageAfter`, data: x })
        });
        const index = data.findIndex(x => x.id == "separate_page")
        if (index > -1) {
          data.splice(index, 1)
        }
        const index2 = data.findIndex(x => x.id == "merge_page")
        if (index2 > -1) {
          data.splice(index2, 1)
        }
        if (index_arr.length == 1) {
          const obj = { name: "分页", "id": "separate_page" };
          data.splice(1, 0, obj)
        } else {
          const obj = { name: "合页", "id": "merge_page" };
          data.splice(1, 0, obj)
        }
        return data
      },
      on: async e => {
        if (e.id == "delete") {
          this.current._delPage(this.data.chapter_id, e.data - 1).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index: this.double_pages[parseInt(e.value)].images[0].index })
          })
        }
        else if (e.id == "merge_page") {
          this.current._mergePage(this.data.chapter_id, this.double_pages[parseInt(e.value)].images[1].index - 1, this.double_pages[parseInt(e.value)].images[0].index - 1).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index: this.double_pages[parseInt(e.value)].images[0].index })
          })
        } else if (e.id == "separate_page") {
          this.current._separatePage(this.data.chapter_id,this.double_pages[parseInt(e.value)].images[0].index - 1).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index: this.double_pages[parseInt(e.value)].images[0].index })
          })

        } else if (e.id == "insertPageBefore") {
          this.current._insertPage(this.data.chapter_id, e.data - 1).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index: this.double_pages[parseInt(e.value)].images[0].index })
          })
        } else if (e.id == "insertPageAfter") {
          this.current._insertPage(this.data.chapter_id, e.data).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index: this.double_pages[parseInt(e.value)].images[0].index })
          })
        }
      },
      menu: [
        {
          name: "插入空白页", "id": "insertPage"
        },
        { name: "删除", id: "delete" },
      ]
    })
  }
  async init(_data?: DialogData) {
    if (_data) {
      this.pages = await this.current._getChapter(_data.chapter_id);
      this.page_index = this.data.page_index;
    } else {
      this.pages = this.data.pages as any;
      this.page_index = this.data.page_index;
    }
    const double_list = await this.getDoublePages(this.pages, this.page_index)
    this.double_pages = double_list;
    this.zone.run(() => {
      this.complete()
      setTimeout(() => this.complete(), 150)
    })
  }

  async init2(_data?: DialogData) {
    if (_data) {
      this.pages = await this.current._getChapter(_data.chapter_id);
      this.page_index = this.data.page_index;
    } else {
      this.pages = this.data.pages as any;
      this.page_index = this.data.page_index;
    }
    const double_list = await this.getDoublePages(this.pages, this.page_index)
    this.double_pages = double_list;
  }

  async getDoublePages(pages: { id: string; width: number; height: number; src: string; }[], page_index: number) {
    const list = pages.map((x: any) => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: x.src
    }))
    const is_first_page_cover = await this.current._getChapter_IsFirstPageCover(this.data.chapter_id);

    const double_list = await this.utils.Images.getPageDouble(list, { isFirstPageCover: is_first_page_cover, pageOrder: this.data.comics_config.is_page_order });
    double_list.forEach((x: any) => {
      x.images.forEach((c: any) => {
        if (!x.select) x.select = (c.index - 1) == page_index;
      })
    })
    return double_list
  }
  ngAfterViewInit() {

  }
  complete = () => {
    const node = document.querySelector("#double_page_thumbnail button[select=true]");

    if (node) {
      node.scrollIntoView({ behavior: 'instant', block: "center", inline: "center" });
      (node as any).focus();
      setTimeout(() => {
        document.querySelector("#double_page_thumbnail")!.classList.remove("opacity-0");
      }, 150)
    } else {
      setTimeout(() => {
        this.complete()
      }, 5)
    }
  }

  on(data: any) {
    if (data.images.length == 1) {
      const index = data.images[0].index;
      this.current._chapterPageChange(this.data.chapter_id, index - 1);
    } else {
      if (false) {
        const index = data.images[0].index;
        this.current._chapterPageChange(this.data.chapter_id, index - 1);
      } else {
        const index = data.images[0].index;
        this.current._chapterPageChange(this.data.chapter_id, index - 2);
      }
    }
  }

  close() {
    this.doublePageThumbnail.close();
  }








}
// 插页 删除 合页 分页
