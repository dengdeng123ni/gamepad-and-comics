import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { AppDataService } from 'src/app/library/public-api';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { IndexService } from './index.service';
import { MenuService } from '../../components/menu/menu.service';
import { map } from 'rxjs';
import { DownloadOptionService } from '../../components/download-option/download-option.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  constructor(
    private Current: CurrentService,
    public data: DataService,
    public AppData:AppDataService,
    public indexser:IndexService,
    public GamepadEvent:GamepadEventService,
    public menu:MenuService,
    public router:Router,
    public route: ActivatedRoute

    ) {
      document.body.setAttribute("router", "list")
      document.body.setAttribute("locked_region", "list")
      // this.Current.init();
      GamepadEvent.registerConfig("menu", { region: ["menu_item"] })
      let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));

      const b64_to_utf8 = (str: string) => {
        return decodeURIComponent(window.atob(str));
      }

      id$.subscribe((params:any) => {

      })
  }

  on_list($event:any) {

  }

  on_item(e: { $event: HTMLElement, data: any }) {
    const $event = e.$event;
    const data = e.data;
    this.router.navigate(['/detail', data.id])
  }

  ngAfterViewInit() {
  }

  openedChange(bool){
     if(bool){
      document.body.setAttribute("locked_region", "menu")
     }else{
      if (document.body.getAttribute("locked_region") == "menu") document.body.setAttribute("locked_region", "list")
     }
  }
  mouseleave($event:MouseEvent){
    if($event.offsetX>24) return
    if($event.offsetX+24>window.innerHeight) return
    if(($event.offsetX+13)>window.innerWidth){

    }else{
      this.menu.opened=true;
    }
    // if($event.offsetX<window.innerWidth){

    // }
  }
  drawer_mouseleave($event:MouseEvent){
    if($event.offsetX>240) {
      this.menu.opened=false;
    }
  }
  ngOnDestroy(){

  }

}
