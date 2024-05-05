import { Component, Inject, NgZone } from '@angular/core';
import { OnePageThumbnailMode1Service } from './one-page-thumbnail-mode1.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
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
  ) {
    this.init(this._data);
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
      setTimeout(()=>{
        if (this.data.page_index || this.page_index === 0) {
          let container = document.querySelector("#one_page") as any;
          let node = document.querySelector(`[_id=one_page_item_${this.page_index}]`);
          let observer = new IntersectionObserver(
            changes => {
              changes.forEach(x => {
                if (x.intersectionRatio != 1) {
                  node!.scrollIntoView({ behavior: 'instant',block: "center", inline: "center" })
                  container.classList.remove("opacity-0");
                }
                if(node) observer.unobserve(node);
              });
            }
          );
          if(node) observer.observe(node);
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
    this.page_index=index;
    this.current._pageChange(index)
    this.OnePageThumbnailMode1.close();
  }
}
