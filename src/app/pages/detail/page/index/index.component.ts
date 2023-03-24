import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { GamepadEventService } from 'src/app/library/public-api';
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
      public HandleLeftCircleToolbar:HandleLeftCircleToolbarService
    ) {
      GamepadEvent.registerGlobalEvent({
        "LEFT_ANALOG_PRESS": () => {
          this.HandleLeftCircleToolbar.isToggle();
        },
      })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    id$.subscribe(x => this.current.init(x))
  }
}
