import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContextMenuEventService, GamepadEventService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';
import { ImagesService } from '../../services/images.service';
import { DoublePageThumbnailService } from './double-page-thumbnail.service';
interface DialogData {
  id: number;
  index: number
}
@Component({
  selector: 'app-double-page-thumbnail',
  templateUrl: './double-page-thumbnail.component.html',
  styleUrls: ['./double-page-thumbnail.component.scss']
})
export class DoublePageThumbnailComponent {
  list = [];
  chapterId = null;
  index = -1;
  constructor(
    public images: ImagesService,
    public current: CurrentReaderService,
    public doublePageThumbnail: DoublePageThumbnailService,
    private zone: NgZone,
    public ContextMenuEvent: ContextMenuEventService,
    public config: ConfigReaderService,
    public GamepadEvent: GamepadEventService,
    public general: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.init(this.data.id, this.data.index)

    ContextMenuEvent.register('double_page_thumbnail', {
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
      on: e => {
        if (e.id.split("_")[0] == "delete") {
          const index = parseInt(e.id.split("_")[1]) - 1;
          const obj = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index]
          const id = obj.id;
          this.current.deletePage(this.current.comics.id, this.chapterId, id).then(() => {
            this.init(this.chapterId, this.index)
          })
        } else if (e.id == "merge_page") {
          const node = document.querySelector(`[content_menu_value='${e.value}']`)
          let index_arr = [];
          node.querySelectorAll(".index").forEach(node => {
            index_arr.push(parseInt(node.textContent) - 1)
          })
          const obj = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[0]]
          const obj2 = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[1]]
          this.general.mergePage({ id: obj.id, src: obj.src, src2: obj2.src, id2: obj2.id, }).then(() => {
            this.init(this.chapterId, this.index)
          })
        } else if (e.id == "separate_page") {
          const node = document.querySelector(`[content_menu_value='${e.value}']`)
          let index_arr = [];
          node.querySelectorAll(".index").forEach(node => {
            index_arr.push(parseInt(node.textContent) - 1)
          })
          index_arr.sort();
          const obj = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[0]]
          this.general.separatePage({ id: obj.id, src: obj.src }).then(() => {
            this.init(this.chapterId, this.index)
          })
        } else if (e.id == "insertPageBefore" || e.id == "insertPageAfter") {
          const node = document.querySelector(`[content_menu_value='${e.value}']`)
          let index_arr = [];
          node.querySelectorAll(".index").forEach(node => {
            index_arr.push(parseInt(node.textContent) - 1)
          })
          index_arr.sort();
          const obj = this.current.comics.chapters.find(x => x.id == this.chapterId).images[index_arr[0]]
          const id = obj.id;
          this.current.insertPage(this.current.comics.id, this.chapterId, id, "", e.id == "insertPageBefore" ? "before" : "after")
            .then(() => {
              this.init(this.chapterId, this.index)
            })
        }
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
    GamepadEvent.registerAreaEvent('double_page_thumbnail', {
      LEFT_TRIGGER: () => {
        this.previousChapter();
      },
      RIGHT_TRIGGER: () => {
        this.nextChapter();
      }
    })
  }
  async previousChapter() {
    document.querySelector("#double_page_thumbnail").classList.add("opacity-0");
    const id = this.general.getPreviousChapterId(this.chapterId);
    const index = await this.general.getChapterIndex(id);
    await this.images.loadImages(this.current.comics.chapters.find(x => x.id == this.chapterId).images.map(x => x.small))
    this.init(id, index);
  }
  async nextChapter() {
    document.querySelector("#double_page_thumbnail").classList.add("opacity-0");
    const id = this.general.getNextChapterId(this.chapterId);
    const index = await this.general.getChapterIndex(id);
    await this.images.loadImages(this.current.comics.chapters.find(x => x.id == this.chapterId).images.map(x => x.small))
    this.init(id, index);
  }
  async init(id, index) {
    this.chapterId = id;
    this.index = index;
    const list = this.current.comics.chapters.find(x => x.id == this.chapterId).images.map(x => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: x.small
    }))

    const double_list = await this.images.getPageDouble(list, { isFirstPageCover: this.current.comics.isFirstPageCover, pageOrder: this.current.comics.pageOrder });
    double_list.forEach(x => {
      x.images.forEach(c => {
        if (!x.select) x.select = (c.index - 1) == index;
      })
    })
    this.zone.run(() => {
      this.list = double_list;
      this.complete()
      setTimeout(() => this.complete(), 150)
    })
  }

  ngAfterViewInit() {
    // if(this.list.length){
    //   this.list.forEach(x => {
    //     x.images.forEach(c => {
    //       x.select = (c.index - 1) == this.index;
    //     })
    //   })
    //   setTimeout(()=>{
    //     this.complete()
    //   },50)
    // }
  }
  complete = () => {
    const node = document.querySelector("#double_page_thumbnail button[select=true]");

    if (node) {
      node.scrollIntoView({ block: "center", inline: "center" });
      (node as any).focus();
      setTimeout(() => {
        document.querySelector("#double_page_thumbnail").classList.remove("opacity-0");
      }, 150)
    } else {
      setTimeout(() => {
        this.complete()
      }, 5)
    }
  }

  onClickItem($event, data) {
    if (data.images.length == 1) {
      const index = data.images[0].index;
      this.current.chapterPageChange(this.chapterId, index - 1);
    } else {
      if (this.current.comics.pageOrder) {
        const index = data.images[0].index;
        this.current.chapterPageChange(this.chapterId, index - 1);
      } else {
        const index = data.images[0].index;
        this.current.chapterPageChange(this.chapterId, index - 2);
      }
    }
  }

  close() {
    this.doublePageThumbnail.close();
  }



}
// 插页 删除 合页 分页
