import { Component } from '@angular/core';
import { ContextMenuEventService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { CurrentDetailService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';
import { OnePageThumbnailService } from './one-page-thumbnail.service';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-one-page-thumbnail',
  templateUrl: './one-page-thumbnail.component.html',
  styleUrls: ['./one-page-thumbnail.component.scss']
})
export class OnePageThumbnailComponent {
  page = {
    direction: "after",//after
    quantity: 3
  };
  list = [];
  constructor(
    public current: CurrentDetailService,
    public ContextMenuEvent: ContextMenuEventService,
    public GamepadEvent: GamepadEventService,
    public general: GeneralService,
    public onePageThumbnail: OnePageThumbnailService,
    public i18n: I18nService,
    public loading: LoadingService
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
    if(this.selectedList.length>20) this.loading.open();
    await this.current.deletePages(this.current.comics.id,this.selectedList.map(x=>({chaptersId:x.chapterId,imageId:x.id})))
    this.init()
    if(this.selectedList.length>20) this.loading.close();
  }
//   async selectedRepeatImages() {
//     let list=[];
//     for (let index = 0; index < this.list.length; index++) {
//       for (let index_2 = 0; index_2 < this.list[index].images.length; index_2++) {
//         const res = await fetch(this.list[index].images[index_2].src)
//         const blob = await res.blob();
//         this.list[index].images[index_2].size = blob.size;
//         list.push(blob.size)
//       }
//     };
// console.log(list,[...new Set(list)]);

//     let selectedList = [];
//     this.list.forEach(x => {
//       x.images.forEach(c => {
//         if (c.selected) selectedList.push({ chapterId: x.chapter.id, ...c })
//       })
//     })
//     console.log(selectedList);

//     let selectedRepeatList = [];
//     this.list.forEach(x => {
//       x.images.forEach(c => {
//         const obj = selectedList.find(s => s.size == c.size)
//         console.log(obj);

//         if (c.selected || obj) selectedRepeatList.push({ chapterId: x.chapter.id, ...c })
//       })
//     })
//     this.selectedList = selectedRepeatList

//   }
  selectedList = [];
  close() {
    this.onePageThumbnail.close();
  }
}
