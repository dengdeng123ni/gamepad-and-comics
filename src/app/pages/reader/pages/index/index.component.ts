import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { OnePageThumbnailMode2Service } from '../../components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.service';
import { IndexService } from './index.service';
import { ChaptersListService } from '../../components/chapters-list/chapters-list.service';
import { ToolbarOptionService } from '../../components/toolbar-option/toolbar-option.service';
import { CustomGridService } from '../../components/custom-grid/custom-grid.service';
import { AppDataService, ContextMenuEventService, GamepadEventService, HistoryService, KeyboardEventService } from 'src/app/library/public-api';
import { LoadingCoverService } from '../../components/loading-cover/loading-cover.service';
import { ReaderConfigService } from '../../components/reader-config/reader-config.service';
import { ComicsDetailService } from '../../components/comics-detail/comics-detail.service';
import { KeyboardToolbarService } from '../../components/keyboard-toolbar/keyboard-toolbar.service';
import { PromptService } from '../../services/prompt.service';
import { GamepadToolbarService } from '../../components/gamepad-toolbar/gamepad-toolbar.service';
import { ComicsSettingsService } from '../../components/comics-settings/comics-settings.service';
import { FilterService } from '../../components/filter/filter.service';
import { RepliesPageService } from '../../components/replies-page/replies-page.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ReaderNavbarBarV2Service } from '../../components/reader-navbar-bar-v2/reader-navbar-bar-v2.service';
export const scaleFadeAnimation = trigger('scaleFadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('100ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('100ms ease-in', style({ opacity: 0 })),
  ]),
]);
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [scaleFadeAnimation]
})
export class IndexComponent {
  is_exist_image=false;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public route: ActivatedRoute,
    public App: AppDataService,
    public left: OnePageThumbnailMode2Service,
    public ChaptersList: ChaptersListService,
    public index: IndexService,
    public ToolbarOption: ToolbarOptionService,
    public CustomGrid: CustomGridService,
    public LoadingCover: LoadingCoverService,
    public ReaderConfig: ReaderConfigService,
    public ComicsDetail: ComicsDetailService,
    public KeyboardToolbar: KeyboardToolbarService,
    public KeyboardEvent: KeyboardEventService,
    public GamepadToolbar: GamepadToolbarService,
    public GamepadEvent: GamepadEventService,
    public ComicsSettings: ComicsSettingsService,
    public ContextMenuEvent: ContextMenuEventService,
    public filter: FilterService,
    public Prompt: PromptService,
    public ReaderNavbarBarV2:ReaderNavbarBarV2Service,
    public RepliesPage: RepliesPageService
  ) {

    GamepadEvent.registerAreaEvent('page_reader', {
      B: () => window.history.back()
    })
    this.GamepadEvent.registerGlobalEvent({
      LEFT_ANALOG_PRESS: () => {
        this.KeyboardToolbar.isToggle()
      }
    })
    // this.KeyboardEvent.registerGlobalEvent({
    //   "p": () => this.KeyboardToolbar.isToggle(),

    // })
    // this.KeyboardEvent.registerAreaEvent("double_page_reader",{
    //   "Tab": () => this.KeyboardToolbar.isToggle(),
    // })
    // space
    // setTimeout(()=>{
    //   KeyboardToolbar.open()
    // },1000)


    document.body.setAttribute("router", "reader")
    document.body.setAttribute("locked_region", document.body.getAttribute("router"))



    // ReaderConfig.open();
    // this.LoadingCover.open();
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {
      if (params.get('source')) {
        this.App.setsource(params.get('source'))
        this.data.init();
        this.current._init(params.get('source'), params.get('id').toString() as string, params.get('sid').toString() as string)
        this.filter.init();
        return
      }
      this.data.init();
      this.current._init(this.App.source, params.get('id').toString() as string, params.get('sid').toString() as string)
      this.filter.init();
    })
  }

  on($event: MouseEvent) {
    this.current.on$.next($event)
  }
  ngOnDestroy() {
    this.current.close();
  }
  ngAfterViewInit() {
    const observer = new MutationObserver((mutationsList, observer) => {
       if(document.querySelector("img")){
        this.is_exist_image=true;
        observer.disconnect();
       }
    });
    const config = { attributes: false, childList: true,subtree:true };
    observer.observe(document.querySelector("#_reader_pages"), config);
    this.getIsImage();

  }
  close() {

  }

  getIsImage() {
  }


}
