import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { IndexService } from './index.service';
import { AppDataService, ContextMenuEventService, DbNovelsControllerService, GamepadEventService, HistoryService, KeyboardEventService } from 'src/app/library/public-api';



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
    public route: ActivatedRoute,
    public App:AppDataService,
    public index: IndexService,
    public GamepadEvent:GamepadEventService,
    public DbNovelsController:DbNovelsControllerService
  ) {

    GamepadEvent.registerAreaEvent('page_reader', {
      B:()=>window.history.back()
    })
    this.GamepadEvent.registerGlobalEvent({
      LEFT_ANALOG_PRESS:()=>{
        // this.KeyboardToolbar.isToggle()
      }
    })
    GamepadEvent.registerConfig("novels_reader", { region: ["novels_reader_v1"] })
    GamepadEvent.registerConfig("comics_type", { region: ["comics_type_item"] })
    // this.KeyboardEvent.registerGlobalEvent({
    //   "p": () => this.KeyboardToolbar.isToggle(),

    // })
    // this.KeyboardEvent.registerAreaEvent("double_page_reader",{
    //   "Tab": () => this.KeyboardToolbar.isToggle(),
    // })
    // space
    // setTimeout(()=>{
    //   KeyboardToolbar.open()
    // },1000)
    document.body.setAttribute("router", "novels_reader")
    document.body.setAttribute("locked_region",document.body.getAttribute("router"))

    // ReaderConfig.open();
    // this.LoadingCover.open();
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {
      if (params.get('source')) {
        this.App.setsource(params.get('source'))
        this.data.init();
        this.current._init(params.get('source'),params.get('id').toString() as string, params.get('sid').toString() as string)


        return
      }
      this.data.init();
      this.current._init(this.App.source,params.get('id').toString() as string, params.get('sid').toString() as string)

    })
  }


  on($event: MouseEvent) {
    this.current.on$.next($event)
  }
  ngOnDestroy() {
    this.current.close();
  }
  ngAfterViewInit() {

  }
  close() {

  }

  getIsImage() {
  }


}
