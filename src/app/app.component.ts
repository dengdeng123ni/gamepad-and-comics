import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService, WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService, MessageFetchService, DownloadEventService, DbEventService, ParamsControllerService, I18nService, TouchmoveControllerService, PromptService, IndexdbControllerService, CacheControllerService, ReplaceChannelControllerService, WsControllerService, ArchiveControllerService, TranslateEventService, TemporaryFileService } from './library/public-api';
import { GamepadControllerService } from './library/gamepad/gamepad-controller.service';
import { GamepadEventService } from './library/gamepad/gamepad-event.service';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { ReadRecordChapterService } from './library/read-record-chapter/read-record-chapter.service';
import { TestService } from './composite/test/test.service';
import { bufferCount, Subject } from 'rxjs';
import CryptoJS from 'crypto-js'
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@angular/cdk/platform';
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



declare global {
  interface Window {
    _gh_receive_message?: (message: any) => Promise<any>; // 通道接收消息
    _gh_translate_register?: (lang: string, json: any) => void // 注册翻译
    _gh_menu_update?: () => void; // 更新菜单
    _gh_page_reset?: () => void; // 重置页面
    _gh_execute_eval?: (url: string, javascript: string) => Promise<any>; // 执行代码
    _gh_fetch?: (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>; // 请求
    _gh_add_comics?: (pages: Array<string>, option: { title?: string }) => Promise<string> // 添加漫画 返回漫画ID
    _gh_register_params?: Function; // 注册参数
    _gh_generate_file_path?: (name: string, event: (e: any) => string) => void; // 生成文件路径
    _gh_get_html?: (url: RequestInfo | URL) => Promise<Response>;  // 获取html
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
  }
}

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
    public TranslateEvent: TranslateEventService,
    public CacheController: CacheControllerService,
    private webCh: CacheControllerService,
    public GamepadController: GamepadControllerService,
    public KeyboardController: KeyboardControllerService,
    public GamepadEvent: GamepadEventService,
    public MessageController: MessageControllerService,
    public MessageFetch: MessageFetchService,
    public MessageEvent: MessageEventService,
    public TemporaryFile:TemporaryFileService,
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
    public ArchiveController: ArchiveControllerService,
    private translate: TranslateService,
    public webDb: IndexdbControllerService,
    public DbEvent: DbEventService,
    public Prompt: PromptService,
    public I18n: I18nService,
    public platform: Platform,
    public App: AppDataService
  ) {
    window._gh_data = {};


    window.addEventListener("beforeunload", async (event) => {
      const list: any = await this.ReplaceChannelController.original.webDb.getAll('temporary_file')
      list.forEach(x => {
        this.ReplaceChannelController.original.webDb.deleteByKey('temporary_file', x.id)
      })
    });


   let obj1:any=                           {
    "id": "f_tag",
    "name": "标签",
    "type": "tag_multiple",
    "options": [
      {
        "title": "语言:",
        "tags": [
          {
            "name": "korean",
            "id": "language:korean"
          },
          {
            "name": "已翻译",
            "id": "language:translated"
          },
          {
            "name": "中文",
            "id": "language:chinese"
          },
          {
            "name": "重写",
            "id": "language:rewrite"
          },
          {
            "name": "泰国",
            "id": "language:thai"
          },
          {
            "name": "英语",
            "id": "language:english"
          },
          {
            "name": "西班牙语",
            "id": "language:spanish"
          }
        ]
      },
      {
        "title": "女:",
        "tags": [
          {
            "name": "领子",
            "id": "female:collar"
          },
          {
            "name": "皮带",
            "id": "female:leash"
          },
          {
            "name": "丝袜",
            "id": "female:stockings"
          },
          {
            "name": "ahegao",
            "id": "female:ahegao"
          },
          {
            "name": "巨乳",
            "id": "female:\"big breasts$\""
          },
          {
            "name": "口交",
            "id": "female:blowjob"
          },
          {
            "name": "舔阴",
            "id": "female:cunnilingus"
          },
          {
            "name": "亲吻",
            "id": "female:kissing"
          },
          {
            "name": "nakadashi",
            "id": "female:nakadashi"
          },
          {
            "name": "paizuri",
            "id": "female:paizuri"
          },
          {
            "name": "喷水",
            "id": "female:squirting"
          },
          {
            "name": "mesuiki",
            "id": "female:mesuiki"
          },
          {
            "name": "乳头刺激",
            "id": "female:\"nipple stimulation$\""
          },
          {
            "name": "马尾辫",
            "id": "female:ponytail"
          },
          {
            "name": "唯一女性",
            "id": "female:\"sole female$\""
          },
          {
            "name": "sumata",
            "id": "female:sumata"
          },
          {
            "name": "x-ray",
            "id": "female:x-ray"
          },
          {
            "name": "摘花",
            "id": "female:defloration"
          },
          {
            "name": "浸渍",
            "id": "female:impregnation"
          },
          {
            "name": "强奸",
            "id": "female:rape"
          },
          {
            "name": "女学生制服",
            "id": "female:\"schoolgirl uniform$\""
          },
          {
            "name": "露阴癖",
            "id": "female:exhibitionism"
          },
          {
            "name": "毛茸茸的",
            "id": "female:hairy"
          },
          {
            "name": "羞辱",
            "id": "female:humiliation"
          },
          {
            "name": "公共用途",
            "id": "female:\"public use$\""
          },
          {
            "name": "睡觉",
            "id": "female:sleeping"
          },
          {
            "name": "连裤袜",
            "id": "female:pantyhose"
          },
          {
            "name": "bbw",
            "id": "female:bbw"
          },
          {
            "name": "大屁股",
            "id": "female:\"big ass$\""
          },
          {
            "name": "精灵",
            "id": "female:elf"
          },
          {
            "name": "fishnets",
            "id": "female:fishnets"
          },
          {
            "name": "不寻常的牙齿",
            "id": "female:\"unusual teeth$\""
          },
          {
            "name": "醉酒",
            "id": "female:drunk"
          },
          {
            "name": "女性统治",
            "id": "female:femdom"
          },
          {
            "name": "指法",
            "id": "female:fingering"
          },
          {
            "name": "手淫",
            "id": "female:masturbation"
          },
          {
            "name": "大乳晕",
            "id": "female:\"big areolae$\""
          },
          {
            "name": "扶他那里",
            "id": "female:futanari"
          },
          {
            "name": "比基尼",
            "id": "female:bikini"
          },
          {
            "name": "后宫",
            "id": "female:harem"
          },
          {
            "name": "kemonomimi",
            "id": "female:kemonomimi"
          },
          {
            "name": "泳衣",
            "id": "female:swimsuit"
          },
          {
            "name": "尾巴",
            "id": "female:tail"
          },
          {
            "name": "美人痣",
            "id": "female:\"beauty mark$\""
          },
          {
            "name": "口交脸",
            "id": "female:\"blowjob face$\""
          },
          {
            "name": "bukkake",
            "id": "female:bukkake"
          },
          {
            "name": "双重渗透",
            "id": "female:\"double penetration$\""
          },
          {
            "name": "无情的性爱",
            "id": "female:\"emotionless sex$\""
          },
          {
            "name": "拍摄",
            "id": "female:filming"
          },
          {
            "name": "勒索",
            "id": "female:blackmail"
          },
          {
            "name": "netorare",
            "id": "female:netorare"
          },
          {
            "name": "正文",
            "id": "female:\"body writing$\""
          },
          {
            "name": "兔女郎",
            "id": "female:\"bunny girl$\""
          },
          {
            "name": "手套",
            "id": "female:gloves"
          },
          {
            "name": "gyaru",
            "id": "female:gyaru"
          },
          {
            "name": "哺乳",
            "id": "female:lactation"
          },
          {
            "name": "内衣",
            "id": "female:lingerie"
          },
          {
            "name": "shimaidon",
            "id": "female:shimaidon"
          },
          {
            "name": "不寻常的学生",
            "id": "female:\"unusual pupils$\""
          },
          {
            "name": "性玩具",
            "id": "female:\"sex toys$\""
          },
          {
            "name": "Yuri",
            "id": "female:yuri"
          },
          {
            "name": "遮眼刘海",
            "id": "female:\"eye-covering bang$\""
          },
          {
            "name": "巨乳",
            "id": "female:\"huge breasts$\""
          },
          {
            "name": "milf",
            "id": "female:milf"
          },
          {
            "name": "大乳头",
            "id": "female:\"big nipples$\""
          },
          {
            "name": "作弊",
            "id": "female:cheating"
          },
          {
            "name": "女牛仔",
            "id": "female:cowgirl"
          },
          {
            "name": "彩绘指甲",
            "id": "female:\"painted nails$\""
          },
          {
            "name": "发髻",
            "id": "female:\"hair buns$\""
          },
          {
            "name": "乳头内陷",
            "id": "female:\"inverted nipples$\""
          },
          {
            "name": "小乳房",
            "id": "female:\"small breasts$\""
          },
          {
            "name": "petplay",
            "id": "female:petplay"
          }
        ]
      },
      {
        "title": "其他:",
        "tags": [
          {
            "name": "马赛克审查",
            "id": "other:\"mosaic censorship$\""
          },
          {
            "name": "全彩",
            "id": "other:\"full color$\""
          },
          {
            "name": "未经审查",
            "id": "other:uncensored"
          },
          {
            "name": "多作品系列",
            "id": "other:\"multi-work series$\""
          },
          {
            "name": "故事情节",
            "id": "other:\"story arc$\""
          },
          {
            "name": "soushuuhen",
            "id": "other:soushuuhen"
          },
          {
            "name": "粗略翻译",
            "id": "other:\"rough translation$\""
          },
          {
            "name": "汇编",
            "id": "other:compilation"
          }
        ]
      },
      {
        "title": "男:",
        "tags": [
          {
            "name": "bbm",
            "id": "male:bbm"
          },
          {
            "name": "眼镜",
            "id": "male:glasses"
          },
          {
            "name": "肛门",
            "id": "male:anal"
          },
          {
            "name": "熊孩子",
            "id": "male:\"bear boy$\""
          },
          {
            "name": "大阴茎",
            "id": "male:\"big penis$\""
          },
          {
            "name": "catboy",
            "id": "male:catboy"
          },
          {
            "name": "狗男孩",
            "id": "male:\"dog boy$\""
          },
          {
            "name": "毛茸茸",
            "id": "male:furry"
          },
          {
            "name": "巨大的阴茎",
            "id": "male:\"huge penis$\""
          },
          {
            "name": "仅限男性",
            "id": "male:\"males only$\""
          },
          {
            "name": "多次性高潮",
            "id": "male:\"multiple orgasms$\""
          },
          {
            "name": "肌肉",
            "id": "male:muscle"
          },
          {
            "name": "狼孩",
            "id": "male:\"wolf boy$\""
          },
          {
            "name": "yaoi",
            "id": "male:yaoi"
          },
          {
            "name": "肛交",
            "id": "male:\"anal intercourse$\""
          },
          {
            "name": "避孕套",
            "id": "male:condom"
          },
          {
            "name": "唯一男性",
            "id": "male:\"sole male$\""
          },
          {
            "name": "dilf",
            "id": "male:dilf"
          },
          {
            "name": "cowman",
            "id": "male:cowman"
          },
          {
            "name": "角",
            "id": "male:horns"
          },
          {
            "name": "穿孔",
            "id": "male:piercing"
          },
          {
            "name": "深色皮肤",
            "id": "male:\"dark skin$\""
          },
          {
            "name": "束缚",
            "id": "male:bondage"
          },
          {
            "name": "onahole",
            "id": "male:onahole"
          },
          {
            "name": "摩擦法",
            "id": "male:frottage"
          },

          {
            "name": "tomgirl",
            "id": "male:tomgirl"
          },
          {
            "name": "校服",
            "id": "male:\"schoolboy uniform$\""
          },
          {
            "name": "双性恋",
            "id": "male:bisexual"
          },
          {
            "name": "crossdressing",
            "id": "male:crossdressing"
          },
          {
            "name": "嗯三人行",
            "id": "male:\"mmm threesome$\""
          },

          {
            "name": "出汗",
            "id": "male:sweating"
          },
          {
            "name": "卖淫",
            "id": "male:prostitution"
          },
          {
            "name": "大球",
            "id": "male:\"big balls$\""
          },
          {
            "name": "大肌肉",
            "id": "male:\"big muscles$\""
          },
          {
            "name": "疤痕",
            "id": "male:scar"
          },
          {
            "name": "精神控制",
            "id": "male:\"mind control$\""
          },
          {
            "name": "贞操带",
            "id": "male:\"chastity belt$\""
          }
        ]
      },
      {
        "title": "混合:",
        "tags": [
          {
            "name": "乱伦",
            "id": "mixed:incest"
          },
          {
            "name": "inseki",
            "id": "mixed:inseki"
          },
          {
            "name": "ffm 三人行",
            "id": "mixed:\"ffm threesome$\""
          },
          {
            "name": "组",
            "id": "mixed:group"
          },
          {
            "name": "mmf 三人行",
            "id": "mixed:\"mmf threesome$\""
          }
        ]
      }
    ]
  }


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
    let clientName = localStorage.getItem('clientName');
    if (!clientId) {
      clientId = `_${Date.now()}`;
      localStorage.setItem('clientId', clientId);
      localStorage.setItem('clientName', clientId);
      this.is_first_enable = true;
    }else if (!clientName) {
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
      this.translate.setDefaultLang(language);
      this.translate.use(language).subscribe();

      document.querySelector("html").setAttribute('lang', language)
    } else {
      let arr = ["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"].filter(x => navigator.languages.includes(x));
      if (arr && arr.length) {
        this.translate.setDefaultLang(arr[0]);
        this.translate.use(arr[0]).subscribe();
        document.body.setAttribute('language', arr[0])
        localStorage.setItem("language", arr[0])
        document.querySelector("html").setAttribute('lang', arr[0])
      } else {
        this.translate.addLangs(["en", "ru", "zh", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"]);
        this.translate.setDefaultLang('en');
        this.translate.use('en').subscribe();
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

      if (config.default_load_script) {
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
