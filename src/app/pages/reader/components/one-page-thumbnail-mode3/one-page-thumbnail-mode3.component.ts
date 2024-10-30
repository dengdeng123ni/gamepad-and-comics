import { Component, Inject, NgZone } from '@angular/core';
import { OnePageThumbnailMode3Service } from './one-page-thumbnail-mode3.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ContextMenuEventService } from 'src/app/library/public-api';
interface DialogData {
  chapter_id: string;
  page_index: number
}
@Component({
  selector: 'app-one-page-thumbnail-mode3',
  templateUrl: './one-page-thumbnail-mode3.component.html',
  styleUrls: ['./one-page-thumbnail-mode3.component.scss']
})
export class OnePageThumbnailMode3Component {
  pages: any = [];
  page_index = 0;
  chapter_id = [];
  constructor(
    public current: CurrentService,
    public data: DataService,
    public OnePageThumbnailMode3: OnePageThumbnailMode3Service,
    @Inject(MAT_BOTTOM_SHEET_DATA) public _data: DialogData,
    private zone: NgZone,
    public ContextMenuEvent: ContextMenuEventService
  ) {
    this.init(this._data);
    if (data.is_cache) {
      ContextMenuEvent.register('one_page_thumbnail_mode3', {
        on: async e => {
          if (e.id == "delete") {
            this.current._delPage(this.data.chapter_id, parseInt(e.value)).then(() => {
              this.init2({ chapter_id: this.data.chapter_id, page_index: parseInt(e.value) })
            })
          } else if (e.id == "insertPageBefore") {
            this.current._insertPage(this.data.chapter_id, parseInt(e.value)).then(() => {
              this.init2({ chapter_id: this.data.chapter_id, page_index: parseInt(e.value) })
            })
          } else if (e.id == "insertPageAfter") {
            this.current._insertPage(this.data.chapter_id, parseInt(e.value) + 1).then(() => {
              this.init2({ chapter_id: this.data.chapter_id, page_index: parseInt(e.value) })
            })
          } else if (e.id == "insertWhitePageBefore") {
            this.current._insertWhitePage(this.data.chapter_id, parseInt(e.value)).then(() => {
              this.init2({ chapter_id: this.data.chapter_id, page_index: parseInt(e.value) })
            })
          } else if (e.id == "insertWhitePageAfter") {
            this.current._insertWhitePage(this.data.chapter_id, parseInt(e.value) + 1).then(() => {
              this.init2({ chapter_id: this.data.chapter_id, page_index: parseInt(e.value) })
            })
          }
        },
        menu: [
          {
            name: "插入空白页", "id": "insertWhitePage", submenu: [
              { name: "前", "id": "insertWhitePageBefore" },
              {
                name: "后", "id": "insertWhitePageAfter"
              },
            ]
          },
          {
            name: "插入", "id": "insertPage", submenu: [
              { name: "前", "id": "insertPageBefore" },
              {
                name: "后", "id": "insertPageAfter"
              },
            ]
          },

          { name: "删除", id: "delete" },
        ]
      })
    } else {
      ContextMenuEvent.register('one_page_thumbnail_mode3', {})
    }

  }
  async init2(_data?: DialogData) {
    if (_data) {
      this.pages = await this.current._getChapter(_data.chapter_id);
      this.page_index = this.data.page_index;
    } else {
      this.pages = this.data.pages as any;
      this.page_index = this.data.page_index;
    }


  }

  async init(_data?: DialogData) {
    if (_data) {
      this.pages = await this.current._getChapter(_data.chapter_id);
      this.page_index = this.data.page_index;
    } else {
      this.pages = this.data.pages as any;
      this.page_index = this.data.page_index;
    }
    this.zone.run(() => {
      setTimeout(() => {
        if (this.data.page_index || this.page_index === 0) {
          let container = document.querySelector("#one_page_thumbnail_mode3") as any;
          let node = document.querySelector(`[_id=one_page_thumbnail_mode3_${this.page_index}]`);
          let observer = new IntersectionObserver(
            changes => {
              changes.forEach(x => {
                if (x.intersectionRatio != 3) {
                  node!.scrollIntoView({ behavior: 'instant', block: "center", inline: "center" })
                  container.classList.remove("opacity-0");
                }
                if (node) observer.unobserve(node);
              });
            }
          );
          if (node) observer.observe(node);
        }
      })
    })

  }

  ngOnDestroy() {
  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {

  }
  on(index: number) {
    this.page_index = index;
    this.current._pageChange(index)
    this.OnePageThumbnailMode3.close();
  }
}
