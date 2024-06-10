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
    public doublePageThumbnail:DoublePageThumbnailService,
    public ContextMenuEvent:ContextMenuEventService
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
        data[delete_index].submenu = index_arr.map(x => ({ name: x, id: `delete_${x}` }));
        const index = data.findIndex(x => x.id == "separate_page")
        if (index > -1) {
          data.splice(index, 1)
        }
        const index2 = data.findIndex(x => x.id == "merge_page")
        if (index2 > -1) {
          data.splice(index2, 1)
        }
        if (index_arr.length == 1) {
          const obj = { name: "separate_page", "id": "separate_page" };
          data.splice(1, 0, obj)
        } else {
          const obj = { name: "merge_page", "id": "merge_page" };
          data.splice(1, 0, obj)
        }
        return data
      },
      on: async e => {
        if (e.value) {
          const index = parseInt(e.id.split("_")[1]) - 1;
          this.current.merge_page(this.data.chapter_id, index,index+1).then(() => {
            this.init()
          })
        }
        //  else if (e.id == "merge_page") {
        //   const node = document.querySelector(`[content_menu_value='${e.value}']`)
        //   let index_arr = [];
        //   node.querySelectorAll(".index").forEach(node => {
        //     index_arr.push(parseInt(node.textContent) - 1)
        //   })
        //   const obj = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[0]]
        //   const obj2 = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[1]]
        //   this.general.mergePage({ id: obj.id, src: obj.src, src2: obj2.src, id2: obj2.id, }).then(() => {
        //     this.init(this.chapterId, this.index)
        //   })
        // } else if (e.id == "separate_page") {
        //   const node = document.querySelector(`[content_menu_value='${e.value}']`)
        //   let index_arr = [];
        //   node.querySelectorAll(".index").forEach(node => {
        //     index_arr.push(parseInt(node.textContent) - 1)
        //   })
        //   index_arr.sort();
        //   const obj = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[0]]
        //   this.general.separatePage({ id: obj.id, src: obj.src }).then(() => {
        //     this.init(this.chapterId, this.index)
        //   })
        // } else if (e.id == "insertPageBefore" || e.id == "insertPageAfter") {
        //   const node = document.querySelector(`[content_menu_value='${e.value}']`)
        //   let index_arr = [];
        //   node.querySelectorAll(".index").forEach(node => {
        //     index_arr.push(parseInt(node.textContent) - 1)
        //   })
        //   index_arr.sort();
        //   const obj = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[0]]
        //   const id = obj.id;
        //   this.current.insertPage(this.current.comics.id, this.chapterId, id, "", e.id == "insertPageBefore" ? "before" : "after")
        //     .then(() => {
        //       this.init(this.chapterId, this.index)
        //     })
        // }
      },
      menu: [
        {
          name: "insert_page", "id": "insertPage", submenu: [
            {
              name: "before", id: "insertPageBefore",
            },
            {
              name: "after", id: "insertPageAfter",
            }
          ],
        },
        { name: "delete", id: "delete" },
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

  async getDoublePages(pages: { id: string; width: number; height: number; src: string; }[], page_index: number) {
    const list = pages.map((x: any) => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: x.src
    }))
    const is_first_page_cover= await this.current._getChapter_IsFirstPageCover(this.data.chapter_id);

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
      node.scrollIntoView({behavior: 'instant', block: "center", inline: "center" });
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
