import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService, WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService, MessageFetchService, DownloadEventService, DbEventService, ParamsControllerService, I18nService, TouchmoveControllerService, PromptService, IndexdbControllerService, CacheControllerService, ReplaceChannelControllerService, WsControllerService, ArchiveControllerService } from './library/public-api';
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
    if (document.body.getAttribute('onkeyboard') == 'true') return true
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
  //

  is_first_enable = false;
  constructor(
    public ReplaceChannelController: ReplaceChannelControllerService,

    public CacheController: CacheControllerService,
    private webCh: CacheControllerService,
    public GamepadController: GamepadControllerService,
    public KeyboardController: KeyboardControllerService,
    public GamepadEvent: GamepadEventService,
    public MessageController: MessageControllerService,
    public MessageFetch: MessageFetchService,
    public MessageEvent: MessageEventService,
    public DbController: DbControllerService,
    public ContextMenuController: ContextMenuControllerService,
    public WsController: WsControllerService,
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
    public TouchmoveController: TouchmoveControllerService,
    public ArchiveController:ArchiveControllerService,
    private translate: TranslateService,
    public webDb: IndexdbControllerService,
    public DbEvent: DbEventService,
    public Prompt: PromptService,
    public I18n: I18nService,
    public App: AppDataService
  ) {
    window._gh_data = {};


    window.addEventListener("beforeunload", async (event) => {
      const list: any = await this.ReplaceChannelController.original.webDb.getAll('temporary_file')
      list.forEach(x => {
        this.ReplaceChannelController.original.webDb.deleteByKey('temporary_file', x.id)
      })
    });


    this.getClientId();

    this.ContextMenuController.onkeydown().subscribe((event: KeyboardEvent) => {
      if (document.body.getAttribute('onkeyboard') == 'true') return true
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

    })

    window._gh_page_reset = () => {
      this.is_loading_page = false;
      setTimeout(() => {
        this.is_loading_page = true
      })
    }
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
    // ["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"];
    // 英语 俄语 中文 德语 葡萄牙语 法语 西班牙語 日语 韩语 意大利语 土耳其语 匈牙利语

    //     let obj = {}

    //     let arr=[]
    //     Object.keys(obj).forEach(x => {
    //       arr.push(obj[x])
    //     })
    //     console.log(obj,arr.join(" @ "));
    //      let str=`
    //     `
    // let arr2=  str.split('@').map(x=>x.trim())
    //     let obj2={}
    //     Object.keys(obj).forEach((x,i) => {
    //       obj2[x] = `${arr2[i]}`
    //     })

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
    GamepadEvent.registerAreaEvent("content_menu", {
      MoveEnd: e => {
        e.focus()
      }
    } as any)
    GamepadEvent.registerAreaEvent("content_menu_submenu", {
      MoveEnd: e => {
        e.focus()
      }
    } as any)
    // GamepadEvent.registerConfig("content_menu", { region: ["content_menu", "content_menu_submenu"] })
    GamepadEvent.registerConfig("select", { region: ["option"] })

    this.init();

  }




  getClientId() {
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
      clientId = `_${Date.now()}`;
      localStorage.setItem('clientId', clientId);
      this.is_first_enable = true;
    }
    document.body.setAttribute('client_id', clientId)
    this.ReplaceChannelController.send_client_id = clientId;

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

  async gampadConfigset() {
    const res: any = await this.webDb.getByKey('data', 'gamepad_controller_config');
    if (res) {
      this.GamepadController.is_voice_controller = res.is_enabled_voice;
      this.GamepadController.GamepadSound.opened = res.is_enabled_sound;
    }
  }

  async setLanguage() {
    const language = localStorage.getItem("language")
    let bool = ["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"].includes(language)
    console.log(bool);

    if (bool) {
      this.translate.setDefaultLang(language);
      this.translate.use(language);

      document.querySelector("html").setAttribute('lang', language)
    } else {
      let arr = ["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"].filter(x => navigator.languages.includes(x));
      if (arr && arr.length) {
        this.translate.setDefaultLang(arr[0]);
        this.translate.use(arr[0]);
        document.body.setAttribute('language', arr[0])
        localStorage.setItem("language", arr[0])
        document.querySelector("html").setAttribute('lang', arr[0])
      } else {
        this.translate.addLangs(["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"]);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        const 游戏手柄与漫画 = await this.I18n.getTranslatedText('游戏手柄与漫画')
        document.title = 游戏手柄与漫画;
        document.body.setAttribute('language', 'en')
        localStorage.setItem("language", 'en')
        document.querySelector("html").setAttribute('lang', 'en')
      }
    }
  }
  async configSet() {
    try {
      // document.querySelector("base").href+'?receiver_client_id=replace_channel_id=is_enabled=true'
      const res = await fetch(document.querySelector("base").href + 'assets/config.json')
      const config = await res.json();

      if(config.default_load_script){
        const default_load_script = config.default_load_script;
        for (let index = 0; index < default_load_script.length; index++) {
          const x = default_load_script[index];
          const url = `${document.querySelector("base").href}${x}`
          const res = await fetch(url)
          const blob = await res.blob();
          await this.pulg.loadBlodJs(blob)
        }
      }
      if (this.is_first_enable) {
         // 第一次启用
           // 第一次加载默认脚本
        const default_register_script = config.default_register_script;
        for (let index = 0; index < default_register_script.length; index++) {
          const x = default_register_script[index];
          const url = `${document.querySelector("base").href}${x}`
          const res = await fetch(url)
          const name = window.decodeURI(url.split("/").at(-1))
          const blob = await res.blob();
          await this.pulg.loadBlodJs(blob)
          await this.pulg.scriptCache(blob, name)
        }
      }

    } catch (error) {
      console.log(error);

    }
  }
  async init() {
    this.setLanguage()
    this.WsController.init()
    await this.webCh.init();
    const obj1 = this.getAllParams(window.location.href);
    await this.MessageFetch.init();
    await this.configSet();
    if (!obj1["noscript"]) await this.pulg.init();
    setTimeout(() => {
      this.gampadConfigset();
      this.ReplaceChannelController.init();
      setTimeout(() => {
        if (navigator) navigator?.serviceWorker?.controller?.postMessage({ type: "_init" })
        this.is_loading_page = true;
        this.GamepadController.init();
        this.svg.init();

        setTimeout(() => {
          this.App.init();
          this.ParamsController.init()
          this.TouchmoveController.init();// 触摸初始化
          this.RoutingController.strRouterReader(obj1["url"]);


          if (!obj1["url"]) {
            // window.addEventListener('visibilitychange', () => {
            //   if (document.hidden) {

            //   } else {
            //     let nn = 0;
            //     const gg = () => {
            //       if (document.hasFocus()) this.RoutingController.getClipboardContents();
            //       setTimeout(() => {
            //         if (nn < 10) {
            //           gg();
            //           nn++;
            //         }
            //       }, 2000)
            //     }
            //     gg();
            //   }
            // });
            // if (document.hasFocus()) this.RoutingController.getClipboardContents();
          }
        }, 50)

      }, 100)
    }, 100)

  }
  getAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

}
