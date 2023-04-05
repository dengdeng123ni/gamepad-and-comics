import { Component } from '@angular/core';
import { ContextMenuEventService, GamepadEventService } from 'src/app/library/public-api';
import { CurrentDetailService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';

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
  ) {
    this.init();
  }
  init() {
    let list = [];
    this.current.comics.chapters.forEach(x => {
      let obj={
        chapter:{ id: x.id, title: x.title },
        images:[]
      };
      if(this.page.direction=="after") x.images.reverse();
      x.images.forEach((s,i) => {
        if(i<this.page.quantity)
        obj.images.push(s)
      });
      if(this.page.direction=="after") obj.images.reverse();
      list.push(obj)
    })
    this.list = list;
  }
}
