import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { IndexListService } from './index.service';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { GamepadLeftCircleToolbarService } from '../../components/gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.service';
import { GamepadEventService } from 'src/app/library/public-api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { AddServerService } from '../../components/add-server/add-server.service';
import { LoadingService } from '../../components/loading/loading.service';
import { AddLocalServerPathService } from '../../components/add-local-server-path/add-local-server-path.service';

@Component({
  selector: 'app-list-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexListComponent {
  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if(event.code=="Enter"){
      if(document.activeElement==document.body){
       const nodes=document.querySelectorAll("[region='list_mode_item']");
       (nodes[Math.trunc(Math.random() * ((nodes.length-1) - 0) + 0)] as any).click();
      }
    }
  }
  constructor(
    private http: HttpClient,
    public current: CurrentListService,
    public config: ConfigListService,
    public indexList: IndexListService,
    public GamepadLeftCircleToolbar: GamepadLeftCircleToolbarService,
    public GamepadEvent: GamepadEventService,
    public AddServer:AddServerService,
    public route:ActivatedRoute,
    public load:LoadingService,
    public AddLocalServerPath:AddLocalServerPathService
  ) {
    GamepadEvent.registerConfig("list", { region: ["list_menu_item","list_mode_item","list_toolabr_item"] })
    document.body.setAttribute("locked_region","list")
    // let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    // id$.subscribe(x =>{
    //   console.log(x);
    // })
    // console.log(AddServer.open());

    GamepadEvent.registerGlobalEvent({
      "LEFT_ANALOG_PRESS": () => {
        this.GamepadLeftCircleToolbar.isToggle();
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
