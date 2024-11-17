import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbControllerService, ImageService, RoutingControllerService, MessageControllerService, MessageEventService, PulgService, WorkerService, LocalCachService, TabService, SvgService, HistoryComicsListService, KeyboardEventService, WebFileService, ReadRecordService, ImageToControllerService, KeyboardControllerService, MessageFetchService } from './library/public-api';
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
    private translate: TranslateService,
    public App: AppDataService
  ) {
    this.translate.addLangs(['zh']);
    this.translate.setDefaultLang('zh');
    this.translate.use('zh');
    this.keydown.pipe(bufferCount(2)).subscribe((e: any) => {
      this.GamepadController.device2(e.at(-1))
    });
    let obj={};
    Object.keys({
      "手柄与漫画": "手柄与漫画1",
      "继续": "继续1",
      "全部章节": "全部章节1",
      "已选择": "已选择1",
      "方向": "方向1",
      "从上往下": "从上往下1",
      "从下往上": "从下往上1",
      "从左往右": "从左往右1",
      "长图片": "长图片1",
      "缓存": "缓存1",
      "搜索": "搜索1",
      "空格": "空格1",
      "主题": "主题1",
      "支持的网站": "主支持的网站题1",
      "历史记录": "历史记录1",
      "扩展安装说明": "扩展安装说明1",
      "脚本": "脚本1",
      "打开文件夹": "打开文件夹1",
      "控制": "控制1",
      "音频": "音频1",
      "重置": "音频1",
      "关于软件": "关于软件1",
      "向上移动": "向上移动1",
      "向下移动": "向下移动1",
      "向右移动": "向右移动1",
      "个": "点击1",
      "椰树": "椰树1",
      "操作音效": "操作音效1",
      "点击": "点击1",
      "返回": "返回1",
      "右键菜单": "右键菜单1",
      "组合键": "组合键1",
      "工具栏": "工具栏1",
      "移动到上一个": "移动到上一个1",
      "移动到下一个": "移动到下一个1",
      "移动到第一个": "移动到第一个1",
      "移动到最后一个": "移动到最后一个1",
      "重置阅读进度": "重置阅读进度1",
      "鼠标左键": "鼠标左键1",
      "语音控制": "语音控制1",
      "恢复默认配置": "恢复默认配置1",
      "鼠标右键": "鼠标右键1",
      "下载": "下载1",
      "单页": "单页1",
      "双页": "双页1",
      "页面顺序": "页面顺序1",
      "普通": "普通1",
      "日漫": "日漫1",
      "缓存完成": "缓存完成1",
      "数据": "数据1",
      "重置数据": "重置数据1",
      "提前加载": "提前加载1",
      "重新获取": "重新获取1",
      "删除": "删除1",
      "缩略图": "缩略图1",
      "切页": "切页1",
      "设置第一页封面": "设置第一页封面1",
      "章节": "章节1",
      "双页缩略图": "双页缩略图1",
      "单页缩略图": "单页缩略图1",
      "滤镜": "滤镜1",
      "设置": "设置1",
      "全屏": "全屏1",
      "阅读模式": "阅读模式1",
      "左右翻页": "左右翻页1",
      "上下滑动": "上下滑动1",
      "左右滑动": "左右滑动1",
      "页面模式": "页面模式1",
      "普通模式": "普通模式1",
      "日漫模式": "日漫模式1",
      "翻译方向": "翻译方向1",
      "背景颜色": "背景颜色1",
      "默认": "默认1",
      "黑色": "黑色1",
      "白色": "白色1",
      "深蓝": "深蓝1",
      "评价": "评价1",
      "漫画": "漫画1",
      "本": "本1",
      "第一页封面": "第一页封面1",
      "只生成一个文件": "只生成一个文件1",
      "不支持": "不支持1",
      "类型": "类型1",
      "图片工具": "图片工具1",
      "图片滤镜": "图片滤镜1",
      "输入图像": "输入图像1",
      "预览": "预览1",
      "输出图像": "输出图像1",
      "待处理漫画": "待处理漫画1",
      "是否压缩": "是否压缩1",
      "图像宽度": "图像宽度1",
      "图像大小": "图像大小1",
      "图像质量": "图像质量1",
      "图像类型": "图像类型1",
      "页面": "页面1",
      "编辑": "编辑1",
      "完成": "完成1",
      "选项": "选项1",
      "支持网站": "支持网站1",
      "打开网站": "打开网站1",
      "访问漫画的详情页": "访问漫画的详情页1",
      "复制漫画的详情页链接": "复制漫画的详情页链接1",
      "转跳到本网站的链接": "转跳到本网站的链接1",
      "添加对应支持网站,需要通过脚本进行添加": "添加对应支持网站,需要通过脚本进行添加1",
      "全选": "全选1",
      "滤镜和压缩": "滤镜和压缩1",
      "图像处理": "图像处理1",
      "灰度": "灰度1",
      "棕褐色": "棕褐色1",
      "布朗尼": "布朗尼1",
      "反转颜色": "反转颜色1",
      "柯达胶卷": "柯达胶卷1",
      "宝丽来": "宝丽来1",
      "打开": "反转颜色1",
      "更新": "柯达胶卷1",
      "清除": "宝丽来1",
      "全部脚本": "全部脚本1",
      "已使用缓存空间": "全部脚本1",
      "强制更新版本": "全部脚本1",
      "赞助作者": "全部脚本1",
      "赞助": "全部脚本1",
      "github": "全部脚本1",
      "加载中": "加载中1",
      "加载成功": "加载成功",
      "图片": "图片",
      "第": "第",
      "生成文件中": "日漫",
      "生成文件成功": "全部脚本1",
      "已完成": "日漫",
      "页": "页"
    }
    ).forEach(x=>{
     obj[x]=`${x}1`

    })
    // console.log(obj);



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
    this.init();

    // GamepadEvent.areaEvents("content_menu",{
    //   UP:()=>
    // })

    // this.GamepadEvent.registerAreaEvent("content_menu", {
    //   "UP": () => {
    //     this.GamepadController.setMoveTargetPrevious();
    //   },
    //   "DOWN": () => {
    //     this.GamepadController.setMoveTargetNext();
    //   },
    //   "LEFT": () => {
    //     this.GamepadController.setMoveTargetPrevious();
    //   },
    //   "RIGHT": () => {
    //     this.GamepadController.setMoveTargetNext();
    //   }
    // })

  }
  ngOnDestroy() {
    this.keydown.unsubscribe();
  }
  ngAfterViewInit() {
    const id = localStorage.getItem('theme')
    if (id) {
      document.documentElement.setAttribute('theme', id)
    }
  }
  async init() {
    await this.MessageFetch.init();
    await this.pulg.init();

    setTimeout(() => {
      if (navigator) navigator?.serviceWorker?.controller?.postMessage({ type: "_init" })
      this.getPulgLoadingFree();
      this.is_loading_page = true;
      this.GamepadController.init();

      this.svg.init();
      setTimeout(() => {
        this.App.init();
        var search= window.location.search;
        const obj = new URLSearchParams(search);
        const url=obj.get('url')
        this.RoutingController.strRouterReader(url);
        if(!url){
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

