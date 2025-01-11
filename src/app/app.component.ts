import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbComicsControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService, WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService, MessageFetchService, DownloadEventService, DbComicsEventService, ParamsControllerService, I18nService, TouchmoveControllerService, PromptService, IndexdbControllerService, CacheControllerService, ReplaceChannelControllerService, WsControllerService, ArchiveControllerService, TranslateEventService, TemporaryFileService, ListMenuEventService } from './library/public-api';
import { GamepadControllerService } from './library/gamepad/gamepad-controller.service';
import { GamepadEventService } from './library/gamepad/gamepad-event.service';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { ReadRecordChapterService } from './library/read-record-chapter/read-record-chapter.service';
import { bufferCount, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CapacitorHttp } from '@capacitor/core';
import { VolumeButtons, VolumeButtonsCallback, VolumeButtonsOptions, VolumeButtonsResult } from '@capacitor-community/volume-buttons';
import { Platform } from '@angular/cdk/platform';

declare global {
  interface Window {
    _gh_receive_message?: (message: any) => Promise<any>; // 通道接收消息
    _gh_translate_register?: (lang: string, json: any) => void // 注册翻译
    _gh_menu_update?: () => void; // 更新菜单
    _gh_page_reset?: () => void; // 重置页面
    _gh_execute_eval?: (url: string, javascript: string) => Promise<any>; // 执行代码
    _gh_fetch?: (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>; // 请求
    _gh_add_comics?: (pages: Array<string>, option: { title?: string }) => Promise<string> // 添加漫画 返回漫画ID
    _gh_generate_file_path?: (name: string, event: (e: any) => string) => void; // 生成文件路径
    _gh_get_html?: (url: RequestInfo | URL) => Promise<Response>;  // 获取html
    _gh_comics_register: Function; // 注册漫画
    _gh_set_data: Function; // 注册漫画
    _gh_get_data: Function; // 注册漫画
    _gh_comics_get_image?: (page_id: string, option?: { source: string, is_cache?: boolean }) => Promise<Blob>; // 获取漫画图片
    _gh_comics_get_pages?: (chapter_id: string, option?: { source: string, is_cache?: boolean }) => Promise<Array<any>>; // 获取漫画章节
    _gh_comics_get_detail?: (comics_id: string, option?: { source: string, is_cache?: boolean }) => Promise<any>; // 获取漫画详情
    _gh_comics_get_list?: (obj: any, option?: { source: string, is_cache?: boolean }) => Promise<Array<any>>; // 获取漫画列表
    _gh_context_menu_register?: (key: string, menuItem: Array<{ id?: string; name: string; type?: string; source?: string; data?: any; click?: Function, submenu?: any; }>) => void; // 注册右键菜单
    _gh_gamepad_down?: (gamepad_buttons: string) => void; // 模拟手柄按下
    _gh_gamepad_up?: (gamepad_buttons: string) => void; // 模拟手柄抬起
    _gh_gamepad_press?: (gamepad_buttons: string) => void; // 模拟手柄连续按下
    _gh_web_db?: any;
    _gh_web_caches?: any
    CryptoJS?: any; // 加密
    QRCode?: any; // 二维码
    _gh_data?: any // 数据
    _gh_novels_get_pages?: Function; // 获取小说章节
    _gh_novels_get_detail?: Function; // 获取小说详情
    _gh_comics_search?: Function; // 搜索漫画
    _gh_params_register?: Function; // 注册参数
    _gh_navigate?: Function; // 注册参数
    _gh_list_menu_register?: Function //  列表菜单注册
    _gh_reader_register?: Function // web组件 name id
    _gh_region_register?: Function; // 区域注册
    _gh_source_get_all_name: Function; // 获取所有数据名称
    _gh_source_get_config: Function; // 获取所有数据名称
    _gh_source_get_event: Function; // 获取所有数据名称
  }
  interface Navigator {
    userAgentData: any
  }
}


// 插件版本v2
// 插件版本v3
// 安卓版本
// ios 版本
// 输入法
// C++


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
  arr=[];

  is_first_enable = false;
  constructor(
    public ReplaceChannelController: ReplaceChannelControllerService,
    public TranslateEvent: TranslateEventService,
    public CacheController: CacheControllerService,
    private webCh: CacheControllerService,
    public GamepadController: GamepadControllerService,
    public KeyboardController: KeyboardControllerService,
    public GamepadEvent: GamepadEventService,
    public MessageController: MessageControllerService,
    public MessageFetch: MessageFetchService,
    public MessageEvent: MessageEventService,
    public TemporaryFile: TemporaryFileService,
    public DbComicsController: DbComicsControllerService,
    public ContextMenuController: ContextMenuControllerService,
    public ListMenuEvent: ListMenuEventService,
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
    public DownloadEvent: DownloadEventService,
    public ParamsController: ParamsControllerService,
    public TouchmoveController: TouchmoveControllerService,
    public ArchiveController: ArchiveControllerService,
    private translate: TranslateService,
    public webDb: IndexdbControllerService,
    public DbComicsEvent: DbComicsEventService,
    public Prompt: PromptService,
    public I18n: I18nService,
    public platform: Platform,
    public App: AppDataService
  ) {
    const options: VolumeButtonsOptions = {};
    const callback: VolumeButtonsCallback = (result: VolumeButtonsResult, err?: any) => {
      if(result.direction=="down"){
        this.GamepadController.device("DOWN")
      }else{
        this.GamepadController.device("UP")
      }
    };
    options.suppressVolumeIndicator = true;
    VolumeButtons.watchVolume(options, callback);
    window._gh_data = {};



    // window._gh_get_html = this.getHtml;
    // window._gh_execute_eval = this.execute_eval;

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

      const url = new URL(window.location.href);
      url.searchParams.set('gh_data', 'reset');
      window.history.pushState({}, '', url);
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
    document.body.setAttribute("is_phone", (window.innerWidth < 480 && (platform.ANDROID || platform.IOS)).toString())

    this.keydown.pipe(bufferCount(1)).subscribe((e: any) => {
      this.GamepadController.device2(e.at(-1))
    });
    this.TranslateEvent.update$.subscribe(x => {
      const language = this.translate.getDefaultLang()
      if (x == language) {
        this.translate.setDefaultLang(language);
        this.translate.reloadLang(language).subscribe(x => {

        });
      }
    })
    // ["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"];
    // 英语 俄语 中文 德语 葡萄牙语 法语 西班牙語 日语 韩语 意大利语 土耳其语 匈牙利语

    let obj = {}

    //     let arr=[]
    // Object.keys(
    // ).forEach(x => {
    //   obj[x]=`${x}123`
    // })
    // console.log(obj);

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
      await DbComicsController.getImage(data.id)
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
    let clientName = localStorage.getItem('clientName');
    if (!clientId) {
      clientId = `_${Date.now()}`;
      localStorage.setItem('clientId', clientId);
      localStorage.setItem('clientName', clientId);
      this.is_first_enable = true;
    } else if (!clientName) {
      localStorage.setItem('clientName', clientId);
    }

    document.body.setAttribute('client_id', clientId)
    document.body.setAttribute('client_name', clientName)
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

    if (bool) {
      this.I18n.setLang(language)
    } else {
      let arr = ["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"].filter(x => navigator.languages.includes(x));
      if (arr && arr.length) {
        this.I18n.setDefaultLang(arr[0])
      } else {
        this.I18n.setDefaultLang('en')
      }
    }
  }
  async configSet() {
    try {
      // document.querySelector("base").href+'?receiver_client_id=replace_channel_id=is_enabled=true'
      const res = await fetch(document.querySelector("base").href + 'assets/config.json')
      const config = await res.json();

      if (config.default_load_script) {
        const default_load_script = config.default_load_script;
        for (let index = 0; index < default_load_script.length; index++) {
          const x = default_load_script[index];
          const url = `${document.querySelector("base").href}${x}`
          const res = await fetch(url)
          const blob = await res.blob();
          await this.pulg.loadBlodJs(blob, url)
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
          await this.pulg.loadBlodJs(blob, url)
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
    //   window._gh_fetch= async (url: string, init?: RequestInit): Promise<Response> => {
    //     const res= await CapacitorHttp.get({
    //       url:url,
    //       method:"no-cors"
    //     })
    //     return res as any
    //  };
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
