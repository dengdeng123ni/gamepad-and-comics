import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { IndexService } from './index.service';
import { AppDataService, KeyboardEventService } from 'src/app/library/public-api';
import { KeyboardToolbarService } from '../../components/keyboard-toolbar/keyboard-toolbar.service';
import { MenuService } from '../../services/menu.service';
import { GamepadToolbarService } from '../../components/gamepad-toolbar/gamepad-toolbar.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public index: IndexService,
    public route: ActivatedRoute,
    public AppData: AppDataService,
    public KeyboardToolbar: KeyboardToolbarService,
    public KeyboardEvent: KeyboardEventService,
    public GamepadToolbar:GamepadToolbarService,
    public menu: MenuService
  ) {
    //
    this.KeyboardEvent.registerGlobalEvent({
      "p": () => this.KeyboardToolbar.isToggle()
    })


    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {
      if (params.get('origin')) {
        const origin = params.get('origin');
        this.data.init();
        this.current._init(origin, params.get('id'))
        return
      } else {
        const origin = this.AppData.origin;
        this.data.init();
        this.current._init(origin, params.get('id'))
      }
    })
    document.body.setAttribute("router", "detail")
    document.body.setAttribute("locked_region", "detail")
  }
  openedChange(bool) {
    //  if(bool){
    //   document.body.setAttribute("locked_region", "menu")
    //  }else{
    //   if (document.body.getAttribute("locked_region") == "menu") document.body.setAttribute("locked_region", "list")
    //  }
    this.menu.post()
  }
  ngOnDestroy() {
    this.data.is_left_drawer_opened = false;
    this.current.close();

  }

  on($event) {
    // if ($event.pointerId < 0) return
    if($event.clientX==0&&$event.clientY==0) return
    if ($event.clientX < 72 && $event.clientY < 72) {
      (document.querySelector("#back") as any).click()
    } else {

    }

  }

  on_list($event: HTMLElement) {

  }

  on_item(e: { $event: HTMLElement, data: any }) {
    const $event = e.$event;
    const data = e.data;
    this.router.navigate(['/', this.data.comics_id, data.id,])
  }
  mouseleave($event: MouseEvent) {
    if ($event.offsetX > 24) return
    if ($event.offsetX + 24 > window.innerHeight) return
    if (($event.offsetX + 13) > window.innerWidth) {

    } else {
      this.data.is_left_drawer_opened = true;
    }
    // if($event.offsetX<window.innerWidth){

    // }
  }
  drawer_mouseleave($event: MouseEvent) {
    if ($event.offsetX > 240) {
      this.data.is_left_drawer_opened = false;
    }
  }
}
