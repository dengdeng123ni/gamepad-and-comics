import { Component, HostListener, Query, } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbComicsControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService, WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService, MessageFetchService, DownloadEventService, DbComicsEventService, ParamsControllerService, I18nService, TouchmoveControllerService, PromptService, IndexdbControllerService, CacheControllerService, ReplaceChannelControllerService, WsControllerService, ArchiveControllerService, TranslateEventService, TemporaryFileService, ListMenuEventService } from './library/public-api';
import { GamepadControllerService } from './library/gamepad/gamepad-controller.service';
import { GamepadEventService } from './library/gamepad/gamepad-event.service';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { ReadRecordChapterService } from './library/read-record-chapter/read-record-chapter.service';
import { bufferCount, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@angular/cdk/platform';
import { Mp4Service } from './library/download/mp4.service';
import { GamesSavesService } from './library/games-saves.service';

declare global {
  interface Window {
    _gh_receive_message?: (message: any) => Promise<any>; // 通道接收消息
    _gh_translate_register?: (lang: string, json: any) => void // 注册翻译
    _gh_menu_update?: () => void; // 更新菜单
    _gh_page_reset?: () => void; // 重置页面
    _gh_execute_eval?: (url: string, javascript: string,option?:{cache_duration:number}) => Promise<any>; // 执行代码
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
    _gh_cache_fn?: (json: any, fu: Function, options: { cache_duration: number; }) => Promise<any>;
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


// 功能控制器 是否隐藏功能和显示
// 插件模式
// 视频和小说
// 浏览器脚本执行
// 更多查询器和统一配置
// 二重查询
// 输入法
// 配置局域网地址
// 阅读图标控制
// cookie 配置
// 番茄书架和历史模式和圈子
// 新的阅读控制界面
// 阅读器配置
// 单页缩略图 12345566 替换图片
//
// 下载重写
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
    // return true
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
    public App: AppDataService,
    public Mp4: Mp4Service,
    public GamesSaves:GamesSavesService,
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

        const loadable_register_script = config.loadable_register_script;
        for (let index = 0; index < loadable_register_script.length; index++) {
          const x = loadable_register_script[index];
          const url = `${document.querySelector("base").href}${x}`
          const res = await fetch(url)
          const name = window.decodeURI(url.split("/").at(-1))
          const blob = await res.blob();
          await this.pulg.scriptCache(blob, name,{
            is_enabled:false
          })
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
    await this.configSet();
    if (!obj1["noscript"]) await this.pulg.init();
    await this.GamesSaves.init()




    setTimeout(() => {
      this.gampadConfigset();
      this.ReplaceChannelController.init();
      setTimeout(() => {
        if (navigator) navigator?.serviceWorker?.controller?.postMessage({ type: "_init" })
        this.is_loading_page = true;
        this.GamepadController.init();
        this.svg.init();

        setTimeout(async () => {
          this.App.init();
          this.ParamsController.init()
          this.TouchmoveController.init();// 触摸初始化
          this.RoutingController.strRouterReader(obj1["url"]);



        //   let obj = {
        //     "游戏手柄与漫画": "游戏手柄与漫画",
        //     "继续": "继续",
        //     "全部章节": "全部章节",
        //     "已选择": "已选择",
        //     "方向": "方向",
        //     "从上往下": "从上往下",
        //     "从下往上": "从下往上",
        //     "从左往右": "从左往右",
        //     "从右往左": "从右往左",
        //     "长图片": "长图片",
        //     "缓存": "缓存",
        //     "搜索": "搜索",
        //     "空格": "空格",
        //     "主题": "主题",
        //     "支持的网站": "支持的网站",
        //     "历史记录": "历史记录",
        //     "专用浏览器扩展插件": "专用浏览器扩展插件",
        //     "脚本": "脚本",
        //     "打开文件夹": "打开文件夹",
        //     "控制": "控制",
        //     "音频": "音频",
        //     "重置": "重置",
        //     "关于软件": "关于软件",
        //     "向上移动": "向上移动",
        //     "左摇杆键": "左摇杆键",
        //     "图片大小": "图片大小",
        //     "向下移动": "向下移动",
        //     "向右移动": "向右移动",
        //     "向左移动": "向左移动",
        //     "操作音效": "操作音效",
        //     "点击": "点击",
        //     "返回": "返回",
        //     "右键菜单": "右键菜单",
        //     "组合键": "组合键",
        //     "工具栏": "工具栏",
        //     "移动到上一个": "移动到上一个",
        //     "移动到下一个": "移动到下一个",
        //     "移动到第一个": "移动到第一个",
        //     "移动到最后一个": "移动到最后一个",
        //     "重置阅读进度": "重置阅读进度",
        //     "鼠标左键": "鼠标左键",
        //     "语音控制": "语音控制",
        //     "恢复默认配置": "恢复默认配置",
        //     "鼠标右键": "鼠标右键",
        //     "下载": "下载",
        //     "单页": "单页",
        //     "双页": "双页",
        //     "页面顺序": "页面顺序",
        //     "普通": "普通",
        //     "日漫": "日漫",
        //     "缓存完成": "缓存完成",
        //     "数据": "数据",
        //     "重置数据": "重置数据",
        //     "提前加载": "提前加载",
        //     "重新获取": "重新获取",
        //     "删除": "删除",
        //     "缩略图": "缩略图",
        //     "切页": "切页",
        //     "设置第一页封面": "设置第一页封面",
        //     "章节": "章节",
        //     "双页缩略图": "双页缩略图",
        //     "单页缩略图": "单页缩略图",
        //     "滤镜": "滤镜",
        //     "设置": "设置",
        //     "全屏": "全屏",
        //     "翻页方向": "翻页方向",
        //     "阅读模式": "阅读模式",
        //     "左右翻页": "左右翻页",
        //     "上下滑动": "上下滑动",
        //     "左右滑动": "左右滑动",
        //     "页面模式": "页面模式",
        //     "普通模式": "普通模式",
        //     "日漫模式": "日漫模式",
        //     "翻译方向": "翻译方向",
        //     "背景颜色": "背景颜色",
        //     "默认": "默认",
        //     "黑色": "黑色",
        //     "白色": "白色",
        //     "深蓝": "深蓝",
        //     "评价": "评价",
        //     "漫画": "漫画",
        //     "本": "本",
        //     "第一页封面": "第一页封面",
        //     "只生成一个文件": "只生成一个文件",
        //     "不支持": "不支持",
        //     "类型": "类型",
        //     "图片工具": "图片工具",
        //     "图片滤镜": "图片滤镜",
        //     "输入图像": "输入图像",
        //     "预览": "预览",
        //     "输出图像": "输出图像",
        //     "待处理漫画": "待处理漫画",
        //     "是否压缩": "是否压缩",
        //     "图像宽度": "图像宽度",
        //     "图像大小": "图像大小",
        //     "图像质量": "图像质量",
        //     "图像类型": "图像类型",
        //     "页面": "页面",
        //     "编辑": "编辑",
        //     "完成": "完成",
        //     "选项": "选项",
        //     "支持网站": "支持网站",
        //     "打开网站": "打开网站",
        //     "全选": "全选",
        //     "滤镜和压缩": "滤镜和压缩",
        //     "图像处理": "图像处理",
        //     "灰度": "灰度",
        //     "棕褐色": "棕褐色",
        //     "布朗尼": "布朗尼",
        //     "反转颜色": "反转颜色",
        //     "柯达胶卷": "柯达胶卷",
        //     "宝丽来": "宝丽来",
        //     "打开": "打开",
        //     "更新": "更新",
        //     "清除": "清除",
        //     "全部脚本": "全部脚本",
        //     "已使用缓存空间": "已使用缓存空间",
        //     "强制更新版本": "强制更新版本",
        //     "赞助作者": "赞助作者",
        //     "赞助": "赞助",
        //     "github": "github",
        //     "加载中": "加载中",
        //     "加载成功": "加载成功",
        //     "图片": "图片",
        //     "生成文件中": "生成文件中",
        //     "生成文件成功": "生成文件成功",
        //     "已完成": "已完成",
        //     "页": "页",
        //     "点击下载插件": "点击下载插件",
        //     "解压压缩包": "解压压缩包",
        //     "打开浏览器(Edge 为例子)": "打开浏览器(Edge 为例子)",
        //     "点击浏览器的设置": "点击浏览器的设置",
        //     "打开扩展/插件": "打开扩展/插件",
        //     "打开找到开发者模式打开": "打开找到开发者模式打开",
        //     "点击加载解压缩的扩展": "点击加载解压缩的扩展",
        //     "打开我们解压后的插件文件夹": "打开我们解压后的插件文件夹",
        //     "点击确认": "点击确认",
        //     "成功插件列表会显示 游戏手柄与漫画插件": "成功插件列表会显示 游戏手柄与漫画插件",
        //     "下载插件": "下载插件",
        //     "无": "无",
        //     "平滑": "平滑",
        //     "淡出淡入": "淡出淡入",
        //     "封面流": "封面流",
        //     "翻转": "翻转",
        //     "近大远小": "近大远小",
        //     "覆盖": "覆盖",
        //     "卡片": "卡片",
        //     "旋转": "旋转",
        //     "透明": "透明",
        //     "封面背景": "封面背景",
        //     "切换特效": "切换特效",
        //     "等待输入": "等待输入",
        //     "待处理列表": "待处理列表",
        //     "下载完成": "下载完成",
        //     "可选项": "可选项",
        //     "文件路径": "文件路径",
        //     "关闭": "关闭",
        //     "毛玻璃": "毛玻璃",
        //     "合并章节": "合并章节",
        //     "第一页是否封面": "第一页是否封面",
        //     "反选": "反选",
        //     "自动推断": "自动推断",
        //     "临时数据": "临时数据",
        //     "是": "是",
        //     "否": "否",
        //     "页码": "页码",
        //     "保存": "保存",
        //     "原图": "原图",
        //     "详细设置": "详细设置",
        //     "全部漫画": "全部漫画",
        //     "单行本": "单行本",
        //     "本地文件": "本地文件",
        //     "上": "上",
        //     "下": "下",
        //     "左": "左",
        //     "右": "右",
        //     "退出": "退出",
        //     "本地缓存": "本地缓存",
        //     "通道替换": "通道替换",
        //     "网页版": "网页版",
        //     "打开局域网连接": "打开局域网连接",
        //     "手机版二维码": "手机版二维码",
        //     "其他": "其他",
        //     "添加": "添加",
        //     "已启用": "已启用",
        //     "名称": "名称",
        //     "操作": "操作",
        //     "切换": "切换",
        //     "关闭通道": "关闭通道",
        //     "控制器音效": "控制器音效",
        //     "打开时触发": "打开时触发",
        //     "通道": "通道",
        //     "控制器设置": "控制器设置",
        //     "远程脚本": "远程脚本",
        //     "内置脚本": "内置脚本",
        //     "Github 在线链接": "Github 在线链接",
        //     "当前章节未解锁,需要到对应网站解锁": "当前章节未解锁,需要到对应网站解锁",
        //     "解锁失败,需要到对应网站查看": "解锁失败,需要到对应网站查看",
        //     "解锁成功,以重新获取数据": "解锁成功,以重新获取数据",
        //     "图片数据缓冲中,请稍后再试": "图片数据缓冲中,请稍后再试",
        //     "加载脚本成功,页面刷新加载脚本": "加载脚本成功,页面刷新加载脚本",
        //     "打开文件夹失败": "打开文件夹失败",
        //     "请输入新名称": "请输入新名称",
        //     "确认": "确认",
        //     "取消": "取消",
        //     "高级查询": "高级查询",
        //     "固定查询条件": "固定查询条件",
        //     "重新": "重新",
        //     "合页": "合页",
        //     "插入": "插入",
        //     "插入空白页": "插入空白页",
        //     "页之前插入": "页之前插入",
        //     "前": "前",
        //     "后": "后",
        //     "存档": "存档",
        //     "导出数据": "导出数据",
        //     "导入数据": "导入数据",
        //     "日志": "日志",
        //     "点击后跳转": "点击后跳转",
        //     "页之后插入": "页之后插入",
        //     "离线": "离线",
        //     "网页离线": "网页离线",
        //     "进入网页离线,只会缓存网页资源,恒定版本,不影响其他": "进入网页离线,只会缓存网页资源,恒定版本,不影响其他",
        //     "关闭当前通道": "关闭当前通道",
        //     "当前网站不是PWA": "当前网站不是PWA",
        //     "进入": "进入",
        //     "打开链接": "打开链接",
        //     "确定": "确定",
        //     "重命名": "重命名",
        //     "加入收藏": "加入收藏",
        //     "PDF转图片": "PDF转图片",
        //     "客户端ID": "客户端ID",
        //     "客户端名称": "客户端名称",
        //     "本地服务器": "本地服务器",
        //     "局域网服务器": "局域网服务器",
        //     "复制": "复制",
        //     "复制成功": "复制成功",
        //     "已添加": "已添加",
        //     "最终章": "最终章",
        //     "第一页": "第一页",
        //     "最后一页": "最后一页",
        //     "第一章": "第一章",
        //     "退出网页离线,会强制更新,确认吗": "退出网页离线,会强制更新,确认吗",
        //     "你确定要清除所有缓存吗": "你确定要清除所有缓存吗",
        //     "输入时间范围": "输入时间范围",
        //     "请输入时间": "请输入时间",
        //     "开始时间": "开始时间",
        //     "结束时间": "结束时间",
        //     "右扳机键": "右扳机键",
        //     "左扳机键": "左扳机键",
        //     "左缓冲键": "左缓冲键",
        //     "右缓冲键": "右缓冲键",
        //     "评论": "评论",
        //     "检测到您当前未启用本站专用浏览器插件。为获得更流畅的体验，请下载并启用该插件。": "检测到您当前未启用本站专用浏览器插件。为获得更流畅的体验，请下载并启用该插件。",
        //     "检测到您当前未设置过语言环境。是否需要重新设置当前语言环境。": "检测到您当前未设置过语言环境。是否需要重新设置当前语言环境。",
        //     "如果你喜欢这个项目，请点一个 ⭐️ Star 支持我们！": "如果你喜欢这个项目，请点一个 ⭐️ Star 支持我们！",
        //     "图片数量应小于30张": "图片数量应小于30张",
        //     "视频宽度": "视频宽度",
        //     "视频长度": "视频长度",
        //     "每张图片的显示时间(秒)": "每张图片的显示时间(秒)",
        //     "每张图片出现的次数": "每张图片出现的次数",
        //     "手机版下载": "手机版下载",
        //     "局域网二维码": "局域网二维码",
        //     "最后插入空白页": "最后插入空白页",
        //     "全部": "全部",
        //     "通道名称": "通道名称",
        //     "插页": "插页",
        //     "双页漫画生成逻辑说明": "双页漫画生成逻辑说明"
        //   }
        //   const arrc= ["zh-TW"]

        //   const arr= Object.keys(
        //     obj
        //   )
        //   let obj3={};
        //   for (let index = 0; index < arrc.length; index++) {
        //     const lang = arrc[index];
        //     for (let index = 0; index < arr.length; index++) {
        //       const text = await window._gh_execute_eval(`https://translate.google.com/?sl=zh-CN&tl=${lang}&text=${arr[index]}&op=translate`, `
        //         (async function () {
        //           const sleep = (duration) => {
        //     return new Promise(resolve => {
        //       setTimeout(resolve, duration);
        //     })
        //   }
        //      await sleep(3000)
        //    const text=document.querySelector("#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz > div > div.usGWQd > div > div.lRu31 > span.HwtZe > span > span").textContent
        // return text
        //    })()
        //         `,{
        //           cache_duration:10000000000
        //         });
        //       obj3[arr[index]]=text;
        //       console.log(index,arr.length,obj3);

        //     }
        //     this.saveAs(new Blob([JSON.stringify(obj3)], { type: 'application/json' }), `${lang}.json`)
        //   }

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

  saveAs(blob, fileName) {
    // data为blob格式
    var downloadElement = document.createElement('a');
    var href = URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    URL.revokeObjectURL(href);
  }
  getAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

}
