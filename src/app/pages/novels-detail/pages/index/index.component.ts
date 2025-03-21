import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { IndexService } from './index.service';
import { AppDataService, DbNovelsControllerService, GamepadEventService, KeyboardEventService } from 'src/app/library/public-api';
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
    public GamepadEvent: GamepadEventService,
    public KeyboardToolbar: KeyboardToolbarService,
    public KeyboardEvent: KeyboardEventService,
    public GamepadToolbar: GamepadToolbarService,
    public DbNovelsController: DbNovelsControllerService,
    public menu: MenuService
  ) {
    //
    this.GamepadEvent.registerGlobalEvent({
      LEFT_ANALOG_PRESS: () => {
        this.KeyboardToolbar.isToggle()
      }
    })
    // this.KeyboardEvent.registerGlobalEvent({
    //   "p": () => this.KeyboardToolbar.isToggle()
    // })


    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {
      if (params.get('source')) {
        const source = params.get('source');
        this.AppData.setsource(source)
        this.data.init();
        this.current._init(source, params.get('id'))
        return
      } else {
        const source = this.AppData.source;
        this.data.init();
        this.current._init(source, params.get('id'))
      }
    })
    document.body.setAttribute("router", "detail")
    document.body.setAttribute("locked_region", document.body.getAttribute("router"))
  }



  exportNovel(content) {
    // 将内容转换为小说模式
    let novelContent = content.map((text, index) => `章节 ${index + 1}\n\n${text}\n`).join("\n");

    // 创建 Blob 对象
    let blob = new Blob([novelContent], { type: 'text/plain' });

    // 创建下载链接
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'novel_format.txt';

    // 自动点击下载链接
    link.click();

    // 释放 Blob URL
    URL.revokeObjectURL(link.href);
  }
  openedChange(bool) {
    //  if(bool){
    //   document.body.setAttribute("locked_region", "menu")
    //  }else{
    //   if (document.body.getAttribute("locked_region") == "menu") document.body.setAttribute("locked_region",document.body.getAttribute("router"))
    //  }
    this.menu.post()
  }
  ngOnDestroy() {
    this.data.is_left_drawer_opened = false;
    this.current.close();

  }

  on($event) {
    // if ($event.pointerId < 0) return
    if ($event.clientX == 0 && $event.clientY == 0) return
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
