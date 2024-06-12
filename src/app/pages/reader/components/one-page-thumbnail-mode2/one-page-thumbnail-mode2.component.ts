import { Component, Inject, NgZone } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { OnePageThumbnailMode2Service } from './one-page-thumbnail-mode2.service';
import { ContextMenuEventService } from 'src/app/library/public-api';
interface DialogData {
  chapter_id: string;
  page_index: number
}
@Component({
  selector: 'app-one-page-thumbnail-mode2',
  templateUrl: './one-page-thumbnail-mode2.component.html',
  styleUrls: ['./one-page-thumbnail-mode2.component.scss']
})
export class OnePageThumbnailMode2Component {
  pages: any = [];
  page_index = 0;
  chapter_id = [];

  old_index = -1;
  change$;

  is_hover = false;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public OnePageThumbnailMode2: OnePageThumbnailMode2Service,
    private zone: NgZone,
    public ContextMenuEvent:ContextMenuEventService
  ) {
    this.change$ = this.current.change().subscribe(x => {
      this.zone.run(() => {
        this.pages = x.pages;
        this.page_index = x.page_index;
        this.change();
      })
    })
    this.init();
    ContextMenuEvent.register('one_page_thumbnail_mode2', {
      on: async e => {
        if (e.id == "delete") {
          this.current._delPage(this.data.chapter_id, parseInt(e.value)).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index:  parseInt(e.value) })
          })
        }else if (e.id == "insertPageBefore") {
          this.current._insertPage(this.data.chapter_id, parseInt(e.value)).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index:  parseInt(e.value) })
          })
        } else if (e.id == "insertPageAfter") {
          this.current._insertPage(this.data.chapter_id, parseInt(e.value)+1).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index:  parseInt(e.value) })
          })
        }else if (e.id == "insertWhitePageBefore") {
          this.current._insertWhitePage(this.data.chapter_id, parseInt(e.value)).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index:  parseInt(e.value) })
          })
        } else if (e.id == "insertWhitePageAfter") {
          this.current._insertWhitePage(this.data.chapter_id, parseInt(e.value)+1).then(() => {
            this.init2({ chapter_id: this.data.chapter_id, page_index:  parseInt(e.value) })
          })
        }
      },
      menu: [
        {
          name: "插入空白页", "id": "insertWhitePage",submenu:[
            { name: "前", "id": "insertWhitePageBefore"},
            {
              name: "后", "id": "insertWhitePageAfter"
            },
          ]
        },
        {
          name: "插入", "id": "insertPage",submenu:[
            { name: "前", "id": "insertPageBefore"},
            {
              name: "后", "id": "insertPageAfter"
            },
          ]
        },

        { name: "删除", id: "delete" },
      ]
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


  }
  async init(_data?: DialogData) {
    if (_data) {
      this.pages = await this.current._getChapter(_data.chapter_id);
      this.page_index = this.data.page_index;
    } else {
      this.pages = this.data.pages as any;
      this.page_index = this.data.page_index;
    }
    this.change();

  }
  change() {
    this.zone.run(() => {
      setTimeout(() => {
        if (this.data.page_index || this.page_index === 0) {
          if (this.old_index == this.page_index) return
          let container = document.querySelector("#one_page_thumbnail_mode2") as any;
          let node = document.querySelector(`[_id=one_page_thumbnail_mode2_${this.page_index}]`);
          let observer = new IntersectionObserver(
            changes => {
              changes.forEach(x => {
                if (x.intersectionRatio != 1) {
                   if (!this.is_hover) node!.scrollIntoView({ behavior: 'instant',block: "center", inline: "center" })
                  container.classList.remove("opacity-0");
                  this.old_index = this.page_index;
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
  enter() {
    this.is_hover = true;
  }
  leave() {
    this.is_hover = false;
  }

  ngOnDestroy() {
    this.change$.unsubscribe();
    this.OnePageThumbnailMode2.close();
  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {

  }
  on(index: number) {
    this.page_index = index;
    this.current._pageChange(index)
    // this.OnePageThumbnailMode2.close();
  }
}
