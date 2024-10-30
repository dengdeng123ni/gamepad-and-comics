import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService,WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService } from './library/public-api';
import { GamepadControllerService } from './library/gamepad/gamepad-controller.service';
import { GamepadEventService } from './library/gamepad/gamepad-event.service';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { ReadRecordChapterService } from './library/read-record-chapter/read-record-chapter.service';
import { TestService } from './composite/test/test.service';
import { bufferCount, Subject } from 'rxjs';
import CryptoJS from 'crypto-js'
export const slideInAnimation =
  trigger('routeAnimation', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        })
      ]),
      query(':enter', [
        style({ top: '100vh' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('100ms ease-out', style({ top: '-100vh' }))
        ]),
        query(':enter', [
          animate('100ms ease-out', style({ top: '0vh' }))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  is_loading_page = false;
  is_data_source = true;
  keys = [];
  is_tab = false;

  keydown=new Subject()
  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    let key = "";

    if (event.key == "F12") return true

    if (event.key == "Enter") {
      if (this.is_tab) return true
    } else {
      this.is_tab = false;
    }
    if (event.code == "Space") key = "Space";
    else key = event.key;
    const obj = this.keys.find(x => x == key)
    if (obj) {
      this.keydown.next(key)
      return false
    } else {
      const bool = this.GamepadController.device2(key);
      if (bool) {
        if (event.key == "Tab") {
          this.is_tab = true;
          return true
        }
        return bool
      } else {
        this.keys.push(key)
        return bool
      }
    }
  }



  @HostListener('window:keyup', ['$event'])
  handleKeyUp = (event: KeyboardEvent) => {
    let key = "";
    if (event.code == "Space") key = "Space";
    else key = event.key


    this.keys = this.keys.filter(x => x != key)
    if (key == "Alt") this.GamepadController.Y = false;
    if (key == "Meta") this.GamepadController.Y = false;
  }

  // Tab 控制
  // 键盘 控制
  // 手柄事件
  // 鼠标事件
  // 语音控制
  // 事件列表 列出可以使用的函数
  // 蓝牙
  //
  constructor(
    public GamepadController: GamepadControllerService,
    public KeyboardController:KeyboardControllerService,
    public GamepadEvent: GamepadEventService,
    public MessageController: MessageControllerService,
    public MessageEvent: MessageEventService,
    public DbController: DbControllerService,
    public ContextMenuController: ContextMenuControllerService,
    private contexts: ChildrenOutletContexts,
    public ccc: WebFileService,
    public image: ImageService,
    public pulg: PulgService,
    public webWorker: WorkerService,
    public RoutingController: RoutingControllerService,
    public LocalCach: LocalCachService,
    public tab: TabService,
    public svg:SvgService,
    public HistoryComicsList:HistoryComicsListService,
    public KeyboardEvent:KeyboardEventService,
    public readRecord:ReadRecordService,
    public ReadRecordChapter:ReadRecordChapterService,
    public ImageToController:ImageToControllerService,
    public testService:TestService,
    public App: AppDataService
  ) {

   this.keydown.pipe(bufferCount(2)).subscribe((e:any) => {
    this.GamepadController.device2(e.at(-1))
    });
    // this.testService.open();
    // this.KeyboardEvent.registerGlobalEvent({
    //   "/": () => this.HistoryComicsList.isToggle(),

    // })
    // this.KeyboardEvent.registerGlobalEvent({
    //   ".": () => this.readRecord.isToggle(),
    // })
    // this.KeyboardEvent.registerGlobalEvent({
    //   "m": () => this.readRecord.isToggle(),
    // })
    // this.KeyboardEvent.registerGlobalEvent({
    //   "n": () => this.ReadRecordChapter.isToggle(),
    // })

    //  setTimeout(async ()=>{
    //   const device = await (navigator as any).bluetooth.requestDevice({
    //     optionalServices: ["battery_service", "device_information"],
    //     acceptAllDevices: true,
    //   });


    //  },3000)





    MessageEvent.service_worker_register('local_image', async (event: any) => {
      const data = event.data;
      await DbController.getImage(data.id)
      return { id: data.id, type: "local_image" }
    })

    MessageEvent.service_worker_register('init', async (event: any) => {
      document.body.setAttribute("pwa", "true")
      this.App.is_pwa=true;
      this.App.is_pulg = true;
    })

    this.GamepadEvent.registerAreaEvent("content_menu_submenu", {
      "B": () => {
        this.ContextMenuController.close();
      }
    })

    this.GamepadEvent.registerAreaEvent("content_menu", {
      "B": () => {
        this.ContextMenuController.close();
      }
    })
    GamepadEvent.registerConfig("content_menu", { region: ["content_menu", "content_menu_submenu"] })
    this.init();

  }
  ngOnDestroy() {
    this.keydown.unsubscribe();
  }
  async init() {
    await this.pulg.init();
    setTimeout(() => {
      if (navigator) navigator?.serviceWorker?.controller?.postMessage({ type: "_init" })
      this.getPulgLoadingFree();
      this.is_loading_page = true;
      this.GamepadController.init();
      this.svg.init();
      setTimeout(() => {
        this.App.init();
        window.addEventListener('visibilitychange', () => {
          if (document.hidden) {

          } else {
            let nn=0;
            const gg = () => {
              if (document.hasFocus()) this.RoutingController.getClipboardContents();
              setTimeout(() => {
                if(nn<10) {
                  gg();
                  nn++;
                }
              }, 2000)
            }
            gg();
          }
        });

        if (document.hasFocus()) this.RoutingController.getClipboardContents();
      }, 50)
    }, 200)
    // this.getPulgLoadingFree();
  }
  getAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
  getPulgLoadingFree() {
    if (document.body.getAttribute("pulg")) {
      this.App.is_pulg = true;
    } else {
      setTimeout(() => {
        this.getPulgLoadingFree();
      }, 50)
    }
  }

}

// if (typeof Worker !== 'undefined') {
//   // Create a new
//   const worker = new Worker(new URL('./app.worker', import.meta.url));
//   worker.onmessage = ({ data }) => {
//   };
//   worker.postMessage('hello');

// } else {
//   // Web Workers are not supported in this environment.
//   // You should add a fallback so that your program still executes correctly.

// }

