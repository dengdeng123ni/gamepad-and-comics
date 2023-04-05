import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { GamepadEventService } from 'src/app/library/public-api';
import { DoublePageThumbnailService } from '../../components/double-page-thumbnail/double-page-thumbnail.service';
import { GamepadThumbnailService } from '../../components/gamepad-thumbnail/gamepad-thumbnail.service';
import { HandleLeftCircleToolbarService } from '../../components/handle-left-circle-toolbar/handle-left-circle-toolbar.service';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';
import { OnePageThumbnailService } from '../../components/one-page-thumbnail/one-page-thumbnail.service';

@Component({
  selector: 'app-info-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexDetailComponent {
  constructor
    (
      public current: CurrentDetailService,
      public config: ConfigDetailService,
      private route: ActivatedRoute,
      public GamepadEvent: GamepadEventService,
      public HandleLeftCircleToolbar: HandleLeftCircleToolbarService,
      public gamepadThumbnail: GamepadThumbnailService,
      public doublePageThumbnail: DoublePageThumbnailService,
      public onePageThumbnail:OnePageThumbnailService,
      public general: GeneralService
    ) {
    GamepadEvent.registerGlobalEvent({
      "LEFT_ANALOG_PRESS": () => {
        this.HandleLeftCircleToolbar.isToggle();
      },
    })
    GamepadEvent.registerAreaEventY("section_item", {
      "LEFT": async $event => {
        const id = parseInt($event.getAttribute("id"))
        const index = await this.general.getChapterIndex(id);
        this.gamepadThumbnail.open({
          id: id,
          index: index
        })
      },
      "RIGHT": async $event => {
        const id = parseInt($event.getAttribute("id"))
        const index = await this.general.getChapterIndex(id);
        this.doublePageThumbnail.open({
          id: id,
          index: index
        })
      },
    })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    id$.subscribe(x => this.current.init(x))
    // setTimeout(()=>{
    //   onePageThumbnail.open();
    // },1500)
  }
  ngOnDestroy() {
    this.current.close();
  }
}
