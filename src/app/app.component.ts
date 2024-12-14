import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService, WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService, MessageFetchService, DownloadEventService, DbEventService, ParamsControllerService, I18nService, TouchmoveControllerService, PromptService, IndexdbControllerService, CacheControllerService, ReplaceChannelControllerService, WsControllerService } from './library/public-api';
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
    let obj = {};
    Object.keys(
      {
        "手柄与漫画": "手柄与漫画123213",
        "继续": "继续123213",
        "全部章节": "全部章节123213",
        "已选择": "已选择123213",
        "方向": "方向123213",
        "从上往下": "从上往下123213",
        "从下往上": "从下往上123213",
        "从左往右": "从左往右123213",
        "长图片": "长图片123213",
        "缓存": "缓存123213",
        "搜索": "搜索123213",
        "空格": "空格123213",
        "主题": "主题123213",
        "支持的网站": "支持的网站123213",
        "历史记录": "历史记录123213",
        "专用浏览器扩展插件": "扩展安装说明123213",
        "脚本": "脚本123213",
        "打开文件夹": "打开文件夹123213",
        "控制": "控制123213",
        "音频": "音频123213",
        "重置": "重置123213",
        "关于软件": "关于软件123213",
        "向上移动": "向上移动123213",
        "左摇杆键": "左摇杆键123213",
        "图片大小": "图片大小123213",
        "向下移动": "向下移动123213",
        "向右移动": "向右移动123213",
        "向左移动": "向左移动123213",
        "个": "个123213",
        "椰树": "椰树123213",
        "操作音效": "操作音效123213",
        "点击": "点击123213",
        "返回": "返回123213",
        "右键菜单": "右键菜单123213",
        "组合键": "组合键123213",
        "工具栏": "工具栏123213",
        "移动到上一个": "移动到上一个123213",
        "移动到下一个": "移动到下一个123213",
        "移动到第一个": "移动到第一个123213",
        "移动到最后一个": "移动到最后一个123213",
        "重置阅读进度": "重置阅读进度123213",
        "鼠标左键": "鼠标左键123213",
        "语音控制": "语音控制123213",
        "恢复默认配置": "恢复默认配置123213",
        "鼠标右键": "鼠标右键123213",
        "下载": "下载123213",
        "单页": "单页123213",
        "双页": "双页123213",
        "页面顺序": "页面顺序123213",
        "普通": "普通123213",
        "日漫": "日漫123213",
        "缓存完成": "缓存完成123213",
        "数据": "数据123213",
        "重置数据": "重置数据123213",
        "提前加载": "提前加载123213",
        "重新获取": "重新获取123213",
        "删除": "删除123213",
        "缩略图": "缩略图123213",
        "切页": "切页123213",
        "设置第一页封面": "设置第一页封面123213",
        "章节": "章节123213",
        "双页缩略图": "双页缩略图123213",
        "单页缩略图": "单页缩略图123213",
        "滤镜": "滤镜123213",
        "设置": "设置123213",
        "全屏": "全屏123213",
        "翻页方向": "翻页方向123213",
        "阅读模式": "阅读模式123213",
        "左右翻页": "左右翻页123213",
        "上下滑动": "上下滑动123213",
        "左右滑动": "左右滑动123213",
        "页面模式": "页面模式123213",
        "普通模式": "普通模式123213",
        "日漫模式": "日漫模式123213",
        "翻译方向": "翻译方向123213",
        "背景颜色": "背景颜色123213",
        "默认": "默认123213",
        "黑色": "黑色123213",
        "白色": "白色123213",
        "深蓝": "深蓝123213",
        "评价": "评价123213",
        "漫画": "漫画123213",
        "本": "本123213",
        "第一页封面": "第一页封面123213",
        "只生成一个文件": "只生成一个文件123213",
        "不支持": "不支持123213",
        "类型": "类型123213",
        "图片工具": "图片工具123213",
        "图片滤镜": "图片滤镜123213",
        "输入图像": "输入图像123213",
        "预览": "预览123213",
        "输出图像": "输出图像123213",
        "待处理漫画": "待处理漫画123213",
        "是否压缩": "是否压缩123213",
        "图像宽度": "图像宽度123213",
        "图像大小": "图像大小123213",
        "图像质量": "图像质量123213",
        "图像类型": "图像类型123213",
        "页面": "页面123213",
        "编辑": "编辑123213",
        "完成": "完成123213",
        "选项": "选项123213",
        "支持网站": "支持网站123213",
        "打开网站": "打开网站123213",
        "访问漫画的详情页": "访问漫画的详情页123213",
        "复制漫画的详情页链接": "复制漫画的详情页链接123213",
        "转跳到本网站的链接": "转跳到本网站的链接123213",
        "添加对应支持网站,需要通过脚本进行添加": "添加对应支持网站,需要通过脚本进行添加123213",
        "全选": "全选123213",
        "滤镜和压缩": "滤镜和压缩123213",
        "图像处理": "图像处理123213",
        "灰度": "灰度123213",
        "棕褐色": "棕褐色123213",
        "布朗尼": "布朗尼123213",
        "反转颜色": "反转颜色123213",
        "柯达胶卷": "柯达胶卷123213",
        "宝丽来": "宝丽来123213",
        "打开": "打开123213",
        "更新": "更新123213",
        "清除": "清除123213",
        "全部脚本": "全部脚本123213",
        "已使用缓存空间": "已使用缓存空间123213",
        "强制更新版本": "强制更新版本123213",
        "赞助作者": "赞助作者123213",
        "赞助": "赞助123213",
        "github": "github123213",
        "加载中": "加载中123213",
        "加载成功": "加载成功123213",
        "图片": "图片123213",
        "第": "第123213",
        "生成文件中": "生成文件中123213",
        "生成文件成功": "生成文件成功123213",
        "已完成": "已完成123213",
        "页": "页123213",
        "点击下载插件": "点击下载插件123213",
        "解压压缩包": "解压压缩包123213",
        "打开浏览器(Edge 为例子)": "打开浏览器(Edge 为例子)123213",
        "点击浏览器的设置": "点击浏览器的设置123213",
        "打开扩展/插件": "打开扩展/插件123213",
        "打开找到开发者模式打开": "打开找到开发者模式打开123213",
        "点击加载解压缩的扩展": "点击加载解压缩的扩展123213",
        "打开我们解压后的插件文件夹": "打开我们解压后的插件文件夹123213",
        "点击确认": "点击确认123213",
        "成功插件列表会显示 手柄与漫画插件": "成功插件列表会显示 手柄与漫画插件123213",
        "下载插件": "下载插件123213",
        "无": "无123213",
        "平滑": "平滑123213",
        "淡出淡入": "淡出淡入123213",
        "封面流": "封面流123213",
        "翻转": "翻转123213",
        "近大远小": "近大远小123213",
        "覆盖": "覆盖123213",
        "卡片": "卡片123213",
        "旋转": "旋转123213",
        "透明": "透明123213",
        "封面背景": "封面背景123213",
        "切换特效": "切换特效123213",
        "等待输入": "等待输入123213",
        "待处理列表": "待处理列表123213",
        "下载完成": "下载完成123213",
        "可选项": "可选项123213",
        "文件路径": "文件路径123213",
        "关闭": "关闭123213",
        "毛玻璃": "毛玻璃123213",
        "合并章节": "合并章节123213",
        "第一页是否封面": "第一页是否封面123213",
        "反选": "反选123213",
        "自动推断": "自动推断123213",
        "临时数据": "临时数据123213",
        "是": "是123213",
        "否": "否123213",
        "页码": "页码123213",
        "保存": "保存123213",
        "原图": "原图123213",
        "详细设置": "详细设置123213",
        "全部漫画": "全部漫画123213",
        "单行本": "单行本123213",
        "本地文件": "本地文件123213",
        "上": "上123213",
        "下": "下123213",
        "左": "左123213",
        "右": "右123213",
        "退出": "退出123213",
        "本地缓存": "本地缓存123213",
        "通道替换": "本地缓存123213",
        "网页版": "本地缓存123213",
        "打开局域网连接": "本地缓存123213",
        "手机版二维码": "本地缓存123213",
        "其他": "本地缓存123213",
        "添加": "本地缓存123213",
        "已启用": "本地缓存123213",
        "名称": "本地缓存123213",
        "操作": "本地缓存123213",
        "切换": "本地缓存123213",
        "关闭通道": "本地缓存123213",
        "打开时触发": "本地缓存123213",
        "通道": "本地缓存123213",
        "控制器设置": "本地缓存123213",
        "远程脚本": "本地缓存123213",
        "内置脚本": "本地缓存123213",
        "Github 在线链接": "本地缓存123213",
        "当前章节未解锁,需要到对应网站解锁": "本地缓存123213",
        "解锁失败,需要到对应网站查看": "本地缓存123213",
        "解锁成功,以重新获取数据": "本地缓存123213",
        "图片数据缓冲中,请稍后再试": "本地缓存123213",
        "加载脚本成功,页面刷新加载脚本": "本地缓存123213",
        "打开文件夹失败": "本地缓存123213"
      }

    ).forEach(x => {
      obj[x] = `${x}123213`

    })
    console.log(obj);


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
    // GamepadEvent.registerConfig("content_menu", { region: ["content_menu", "content_menu_submenu"] })
    GamepadEvent.registerConfig("select", { region: ["option"] })

    this.init();

  }




  getClientId() {
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
      clientId = `_${Date.now()}`;
      localStorage.setItem('clientId', clientId);
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
  async getj342() {
    const res: any =await this.webDb.getByKey('data', 'gamepad_controller_config');
    if (res) {
      this.GamepadController.is_voice_controller = res.is_enabled_voice;
      this.GamepadController.GamepadSound.opened = res.is_enabled_sound;
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
    await this.as12312();
    if (!obj1["noscript"]) await this.pulg.init();
    setTimeout(() => {
      this.getj342();


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
          this.ReplaceChannelController.init();
          this.get123();

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
