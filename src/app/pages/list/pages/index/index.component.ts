import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { AppDataService, KeyboardEventService, TouchmoveEventService } from 'src/app/library/public-api';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { IndexService } from './index.service';
import { MenuService } from '../../components/menu/menu.service';
import { map } from 'rxjs';
import { KeyboardToolbarService } from '../../components/keyboard-toolbar/keyboard-toolbar.service';
import { ControllerSettingsService } from '../../components/controller-settings/controller-settings.service';
import { ComicsListV2Service } from '../../components/comics-list-v2/comics-list-v2.service';
import { GamepadToolbarService } from '../../components/gamepad-toolbar/gamepad-toolbar.service';
import { UrlToComicsIdService } from '../../components/url-to-comics-id/url-to-comics-id.service';
import { TabToolbarService } from '../../components/tab-toolbar/tab-toolbar.service';
import { ComicsListConfigService } from '../../components/comics-list-config/comics-list-config.service';
import { ImageToService } from '../../components/image-to/image-to.service';
import { DownloadProgressService } from '../../components/download-progress/download-progress.service';
import { WhenInputtingService } from '../../components/when-inputting/when-inputting.service';
import { MenuSearchService } from '../../components/menu-search/menu-search.service';
import { Platform } from '@angular/cdk/platform';
import { SelectInputNumberService } from '../../components/select-input-number/select-input-number.service';
import { SelectTagMultipleService } from '../../components/select-tag-multiple/select-tag-multiple.service';
import { ReplaceChannelPageService } from '../../components/replace-channel-page/replace-channel-page.service';
import { MobileWebQrcodeService } from '../../components/mobile-web-qrcode/mobile-web-qrcode.service';
import { LanguageSettingsService } from '../../components/language-settings/language-settings.service';
import { FavoritesPageService } from '../../components/favorites-page/favorites-page.service';
import { SelectTimeRangeService } from '../../components/select-time-range/select-time-range.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  has_backdrop = false;

  constructor(
    private Current: CurrentService,
    public data: DataService,
    public AppData: AppDataService,
    public indexser: IndexService,
    public GamepadEvent: GamepadEventService,
    public menu: MenuService,
    public router: Router,
    public route: ActivatedRoute,
    public KeyboardToolbar: KeyboardToolbarService,
    public KeyboardEvent: KeyboardEventService,
    public ControllerSettings: ControllerSettingsService,
    public GamepadToolbar: GamepadToolbarService,
    public ComicsListV2: ComicsListV2Service,
    public UrlToComicsId: UrlToComicsIdService,
    public TabToolbar: TabToolbarService,
    public ComicsListConfig: ComicsListConfigService,
    public imageTo: ImageToService,
    public WhenInputting: WhenInputtingService,
    public DownloadProgress: DownloadProgressService,
    public TouchmoveEvent:TouchmoveEventService,
    public platform: Platform,
    public SelectInputNumber:SelectInputNumberService,
    public SelectTagMultiple:SelectTagMultipleService,
    public ReplaceChannelPage:ReplaceChannelPageService,
    public MobileWebQrcode:MobileWebQrcodeService,
    public LanguageSettings:LanguageSettingsService,
    public FavoritesPage:FavoritesPageService,
    public SelectTimeRange:SelectTimeRangeService,
    public MenuSearch: MenuSearchService
  ) {
    setTimeout(()=>{
      this.router.navigate(['/steam']);
     },100)
    // this.WebpageOffline.open();
    // this.FavoritesPage.open()

    this.has_backdrop= (window.innerWidth < 480 && (platform.ANDROID || platform.IOS))

    // this.MenuSearch.open({
    //   position:{
    //     left:"10px",
    //     top:"10px"
    //   }
    // });
    // this.WhenInputting.open();
    // this.DownloadProgress.open({
    //   panelClass: "_double_page_thumbnail",
    // });
    // this.imageTo.open();
    // ComicsListConfig.open();
    this.GamepadEvent.registerGlobalEvent({
      LEFT_ANALOG_PRESS: () => {
        this.KeyboardToolbar.isToggle()
      }
    })
    // this.KeyboardEvent.registerGlobalEvent({
    //   "p": () => this.KeyboardToolbar.isToggle(),
    //   "o": () => this.TabToolbar.isToggle(),
    // })
    document.body.setAttribute("router", "list")
    document.body.setAttribute("locked_region", document.body.getAttribute("router"))
    // this.Current.init();
    GamepadEvent.registerConfig("menu", { region: ["menu_item", "item"] })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));

    const b64_to_utf8 = (str: string) => {
      return decodeURIComponent(window.atob(str));
    }

    id$.subscribe((params: any) => {

    })

    this.init();
    TouchmoveEvent.register('list',{
      LEFT:()=>{
        this.menu.opened = true;
      },
      RIGHT:()=>{
        this.menu.opened = false;
      },
    })



  }

  async init() {
    await this.data.init();
    await this.menu.init();
    this.data.is_init_free = true;
  }

  on_list($event: any) {

  }

  on_item(e: { $event: HTMLElement, data: any }) {
    const $event = e.$event;
    const data = e.data;
    this.router.navigate(['/detail', data.id])
  }

  ngAfterViewInit() {
  }

  openedChange(bool) {
    if (bool) {

    } else {
      this.menu.opened = false;
    }
    this.menu.post()
  }
  mouseleave($event: MouseEvent) {
    // if($event.offsetX>24) return
    // if($event.offsetX+24>window.innerHeight) return
    // if(($event.offsetX+13)>window.innerWidth){

    // }else{
    //   this.menu.opened=true;
    // }
    // if($event.offsetX<window.innerWidth){

    // }
  }
  drawer_mouseleave($event: MouseEvent) {
    // if($event.offsetX>240) {
    //   this.menu.opened=false;
    // }
  }
  ngOnDestroy() {
    this.data.post();
  }



}
