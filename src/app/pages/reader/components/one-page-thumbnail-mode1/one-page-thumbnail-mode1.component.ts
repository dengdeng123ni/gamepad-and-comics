import { Component, Inject, NgZone } from '@angular/core';
import { OnePageThumbnailMode1Service } from './one-page-thumbnail-mode1.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ContextMenuEventService, NotifyService, WorkerService } from 'src/app/library/public-api';
import { MatSnackBar } from '@angular/material/snack-bar';
interface DialogData {
  chapter_id: string;
  page_index: number
}
@Component({
  selector: 'app-one-page-thumbnail-mode1',
  templateUrl: './one-page-thumbnail-mode1.component.html',
  styleUrls: ['./one-page-thumbnail-mode1.component.scss']
})
export class OnePageThumbnailMode1Component {
  pages: any = [];
  page_index = 0;
  chapter_id = [];
  constructor(
    public current: CurrentService,
    public data: DataService,
    public OnePageThumbnailMode1: OnePageThumbnailMode1Service,
    @Inject(MAT_BOTTOM_SHEET_DATA) public _data: DialogData,
    private zone: NgZone,
    private _snackBar: MatSnackBar,
    public Notify:NotifyService,
    public Worker:WorkerService,
    public ContextMenuEvent: ContextMenuEventService
  ) {
    this.init(this._data);
    this.registerInit()

  }
  async registerInit(){
    if (this.data.is_cache) {
      this.ContextMenuEvent.register('one_page_thumbnail_item', {
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
          }else{
            e.click(this.data.pages[parseInt(e.value)])
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
      this.ContextMenuEvent.register('one_page_thumbnail_item', {
        on: async e => {
          e.click(this.data.pages[parseInt(e.value)])
        }
      })
    }
  }
  async init(_data?: DialogData) {
    let bool=false;

    setTimeout(()=>{
      if(!bool){
        this.Notify.messageBox("图片数据缓冲中,请稍后再试", null, { panelClass: "_chapter_prompt",
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1000
        });
        this.OnePageThumbnailMode1.close();
      }
    },1000)
    bool=await this.current._loadPagesFree(this.data.chapter_id)

    if (_data) {
      this.pages = await this.current._getChapter(_data.chapter_id);
      let urls = this.pages.map(x => x.src) as any;
      if (this.data.is_cache) urls = await this.Worker.workerImageCompression(this.pages.map(x => x.src), 200, 0.7);
      urls.forEach((x,i)=>{
        this.pages[i].src=x;
      })
      this.page_index = this.data.page_index;
    } else {
      this.pages = this.data.pages as any;
      let urls = this.pages.map(x => x.src) as any;
      if (this.data.is_cache) urls = await this.Worker.workerImageCompression(this.pages.map(x => x.src), 200, 0.7);
      urls.forEach((x,i)=>{
        this.pages[i].src=x;
      })
      this.page_index = this.data.page_index;
    }


    this.zone.run(() => {
      setTimeout(() => {
        if (this.data.page_index || this.page_index === 0) {
          let container = document.querySelector("#one_page") as any;
          let node = document.querySelector(`[_id=one_page_item_${this.page_index}]`);
          let observer = new IntersectionObserver(
            changes => {
              changes.forEach(x => {
                if (x.intersectionRatio != 1) {
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
  async init2(_data?: DialogData) {
    if (_data) {
      this.pages = await this.current._getChapter(_data.chapter_id);
      let urls = this.pages.map(x => x.src) as any;
      if (this.data.is_cache) urls = await this.Worker.workerImageCompression(this.pages.map(x => x.src), 200, 0.7);
      urls.forEach((x,i)=>{
        this.pages[i].src=x;
      })
      this.page_index = this.data.page_index;
    } else {
      this.pages = this.data.pages as any;
      let urls = this.pages.map(x => x.src) as any;
      if (this.data.is_cache) urls = await this.Worker.workerImageCompression(this.pages.map(x => x.src), 200, 0.7);
      urls.forEach((x,i)=>{
        this.pages[i].src=x;
      })
      this.page_index = this.data.page_index;
    }


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
    this.OnePageThumbnailMode1.close();
  }
}
