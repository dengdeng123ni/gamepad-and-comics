import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IndexListService } from './index.service';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { HandleLeftCircleToolbarService } from '../../components/handle-left-circle-toolbar/handle-left-circle-toolbar.service';
import { GamepadEventService } from 'src/app/library/public-api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-list-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexListComponent {
  constructor(
    private http: HttpClient,
    public current: CurrentListService,
    public config: ConfigListService,
    public indexList: IndexListService,
    public HandleLeftCircleToolbar: HandleLeftCircleToolbarService,
    public GamepadEvent: GamepadEventService,
    public route:ActivatedRoute
  ) {
    // let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    // id$.subscribe(x =>{
    //   console.log(x);
    // })
    GamepadEvent.registerGlobalEvent({
      "LEFT_ANALOG_PRESS": () => {
        this.HandleLeftCircleToolbar.isToggle();
      },
    })
    this.current.init();
    //  this.SoftwareInformation.open();
  }

  ngOnInit(): void {

  }
  async init() {
  }
  async init2() {

  }
}
