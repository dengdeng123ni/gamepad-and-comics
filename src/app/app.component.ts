import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService, WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService, MessageFetchService, DownloadEventService, DbEventService, ParamsControllerService, I18nService, TouchmoveControllerService, PromptService, IndexdbControllerService, CacheControllerService } from './library/public-api';
import { GamepadControllerService } from './library/gamepad/gamepad-controller.service';
import { GamepadEventService } from './library/gamepad/gamepad-event.service';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { ReadRecordChapterService } from './library/read-record-chapter/read-record-chapter.service';
import { TestService } from './composite/test/test.service';
import { bufferCount, Subject } from 'rxjs';
import CryptoJS from 'crypto-js'
import { TranslateService } from '@ngx-translate/core';
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

declare let navigator: any;
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

  keydown = new Subject()
  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if(document.body.getAttribute('onkeyboard')=='true') return true
    let key = "";
    if (event.key == "F12") return true
    if (event.key == "Backspace") return true


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
        if (event.key == "Enter") return false
        return true
      } else {
        this.keys.push(key)
        if (event.key == "Enter") return false
        return true
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
    public CacheController:CacheControllerService,
    private webCh: CacheControllerService,
    public GamepadController: GamepadControllerService,
    public KeyboardController: KeyboardControllerService,
    public GamepadEvent: GamepadEventService,
    public MessageController: MessageControllerService,
    public MessageFetch: MessageFetchService,
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
    public svg: SvgService,
    public HistoryComicsList: HistoryComicsListService,
    public KeyboardEvent: KeyboardEventService,
    public readRecord: ReadRecordService,
    public ReadRecordChapter: ReadRecordChapterService,
    public ImageToController: ImageToControllerService,
    public testService: TestService,
    public DownloadEvent: DownloadEventService,
    public ParamsController: ParamsControllerService,
    public TouchmoveController:TouchmoveControllerService,
    private translate: TranslateService,
    public webDb: IndexdbControllerService,
    public DbEvent: DbEventService,
    public Prompt:PromptService,
    public I18n: I18nService,
    public App: AppDataService
  ) {
    // is_voice_controller
    // sound
    const system = this.getOperatingSystem()
    if (system == "iOS" || system == "macOS") {
      document.body.setAttribute("is_ios", 'true')
    } else {
      document.body.setAttribute("is_ios", 'false')
    }

    this.keydown.pipe(bufferCount(1)).subscribe((e: any) => {
      this.GamepadController.device2(e.at(-1))
    });
    // let obj = {};
    // Object.keys().forEach(x => {
    //   obj[x] = `${x}`

    // })
    // console.log(obj);


    MessageEvent.service_worker_register('local_image', async (event: any) => {
      const data = event.data;
      await DbController.getImage(data.id)
      return { id: data.id, type: "local_image" }
    })

    MessageEvent.service_worker_register('init', async (event: any) => {
      document.body.setAttribute("pwa", "true")
      this.App.is_pwa = true;
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
    GamepadEvent.registerConfig("select", { region: ["option"] })
    this.init();

    setTimeout(()=>{
      this.cccc();
    },300)

  }
  async cccc() {


  }


  ngOnDestroy() {
    this.keydown.unsubscribe();
  }
  ngAfterViewInit() {

  }
  getAllParams(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    const allParams = Object.fromEntries((params as any).entries());
    return allParams
  }

  async get123() {

    // const list:any = await this.MessageFetch.getAllTabs();
    // console.log(list);
    // for (let index = 0; index < list.length; index++) {
    //   console.log(list[index].url);

    //   try {
    //     await this.RoutingController.strRouterReader(list[index].url);
    //   } catch (error) {

    //   }
    //   await this.sleep(3000)
    // }

  }
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  getOperatingSystem(): string {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('mac os x')) {
      return 'macOS';
    } else if (userAgent.includes('windows nt')) {
      return 'Windows';
    } else if (userAgent.includes('linux')) {
      return 'Linux';
    } else if (userAgent.includes('android')) {
      return 'Android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'iOS';
    } else {
      return 'Unknown';
    }
  }
  async as12312() {
    try {
      const res = await fetch(window.location.origin + '/assets/eval/index.js')
      if (res) {
        this.pulg.loadJS(window.location.origin + '/assets/eval/index.js')
      }
    } catch (error) {

    }
  }
  async init() {
    await this.webCh.init();
    let arr = ['zh', 'en'].filter(x => navigator.languages.includes(x));

    if (arr && arr.length) {
      this.translate.setDefaultLang('zh');
      this.translate.use('zh');
      document.body.setAttribute('language', 'zh')
    } else {
      // this.translate.addLangs(['zh', 'en']);
      // this.translate.setDefaultLang('en');
      // this.translate.use('en');
      // const 手柄与漫画 = await this.I18n.getTranslatedText('手柄与漫画')
      // document.title = 手柄与漫画;
      // document.body.setAttribute('language', 'en')
    }




    const obj1 = this.getAllParams(window.location.href);
    await this.MessageFetch.init();

    // eval()
    await this.as12312();
    if (!obj1["noscript"]) await this.pulg.init();

    setTimeout(() => {
      if (navigator) navigator?.serviceWorker?.controller?.postMessage({ type: "_init" })
      this.is_loading_page = true;
      this.GamepadController.init();
      this.svg.init();

      setTimeout(() => {
        this.App.init();
        this.ParamsController.init()
        this.TouchmoveController.init();
        this.RoutingController.strRouterReader(obj1["url"]);
        this.get123();

        if (!obj1["url"]) {
          window.addEventListener('visibilitychange', () => {
            if (document.hidden) {

            } else {
              let nn = 0;
              const gg = () => {
                if (document.hasFocus()) this.RoutingController.getClipboardContents();
                setTimeout(() => {
                  if (nn < 10) {
                    gg();
                    nn++;
                  }
                }, 2000)
              }
              gg();
            }
          });
          if (document.hasFocus()) this.RoutingController.getClipboardContents();
        }
      }, 50)
    }, 200)
  }
  getAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

}
