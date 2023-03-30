import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { GamepadEventService } from 'src/app/library/public-api';
import { DoublePageThumbnailService } from '../../components/double-page-thumbnail/double-page-thumbnail.service';
import { GamepadThumbnailService } from '../../components/gamepad-thumbnail/gamepad-thumbnail.service';
import { HandleLeftCircleToolbarService } from '../../components/handle-left-circle-toolbar/handle-left-circle-toolbar.service';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';

@Component({
  selector: 'app-info-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexDetailComponent {
  constructor
    (
      public current: CurrentDetailService,
      public config:ConfigDetailService,
      private route: ActivatedRoute,
      public GamepadEvent:GamepadEventService,
      public HandleLeftCircleToolbar:HandleLeftCircleToolbarService,
      public gamepadThumbnail:GamepadThumbnailService,
      public doublePageThumbnail:DoublePageThumbnailService
    ) {
      GamepadEvent.registerGlobalEvent({
        "LEFT_ANALOG_PRESS": () => {
          this.HandleLeftCircleToolbar.isToggle();
        },
      })
      GamepadEvent.registerAreaEventY("section_item", {
        "LEFT": () => this.gamepadThumbnail.open({
          id:this.current.comics.chapter.id,
          index:this.current.comics.chapter.index
        }),
        "RIGHT": () => this.doublePageThumbnail.open({
          id:this.current.comics.chapter.id,
          index:this.current.comics.chapter.index
        }),
      })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    id$.subscribe(x => this.current.init(x))
  }
  ngOnDestroy() {
    this.current.close();
  }
}
