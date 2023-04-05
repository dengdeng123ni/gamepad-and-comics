import { Component } from '@angular/core';
import { ContextMenuEventService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { CurrentDetailService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';
import { OnePageThumbnailService } from './one-page-thumbnail.service';

@Component({
  selector: 'app-one-page-thumbnail',
  templateUrl: './one-page-thumbnail.component.html',
  styleUrls: ['./one-page-thumbnail.component.scss']
})
export class OnePageThumbnailComponent {
  page = {
    direction: "after",//after
    quantity: 1
  };
  list = [];
  constructor(
    public current: CurrentDetailService,
    public ContextMenuEvent: ContextMenuEventService,
    public GamepadEvent: GamepadEventService,
    public general: GeneralService,
    public onePageThumbnail: OnePageThumbnailService,
    public i18n: I18nService
  ) {
    this.init();
  }
  init() {
    let list = [];
    const chapters = JSON.parse(JSON.stringify(this.current.comics.chapters))
    chapters.forEach(x => {
      let obj = {
        chapter: { id: x.id, title: x.title },
        images: []
      };
      if (this.page.direction == "after") x.images.reverse();
      x.images.forEach((s, i) => {
        if (i < this.page.quantity)
          obj.images.push({ ...s, selected: false })
      });
      if (this.page.direction == "after") obj.images.reverse();
      list.push(obj)
    })
    this.list = list;
  }
  change() {
    console.log(this.page);

    this.init();
  }
  on(n, c) {
    this.list[n].images[c].selected = !this.list[n].images[c].selected;
  }
  selectAll() {
    let isAll = false;
    this.list.forEach(x => {
      x.images.forEach(c => {
        if (!c.selected) isAll = true;
      })
    })

    if (isAll) {
      this.list.forEach(x => {
        x.images.forEach(c => {
          c.selected = true;
        })
      })
      return
    }
    this.list.forEach(x => {
      x.images.forEach(c => {
        c.selected = false;
      })
    })

  }
  ngDoCheck(): void {
    let selectedList = [];
    this.list.forEach(x => {
      x.images.forEach(c => {
        if (c.selected) selectedList.push({ chapterId: x.chapter.id, ...c })
      })
    })
    this.selectedList = selectedList
  }
  async selectedDetele() {
    console.log(this.selectedList);
    for (let i = 0; i < this.selectedList.length; i++) {
      const x = this.selectedList[i];
      await this.current.deletePage(this.current.comics.id, x.chapterId, x.id)

    }
    this.init()
    // await this.current.deletePagea()
  }
  selectedList = [];
  close() {
    this.onePageThumbnail.close();
  }
}
