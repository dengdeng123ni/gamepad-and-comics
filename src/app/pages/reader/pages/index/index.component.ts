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
import { AppDataService, HistoryService, KeyboardEventService } from 'src/app/library/public-api';
import { LoadingCoverService } from '../../components/loading-cover/loading-cover.service';
import { ReaderConfigService } from '../../components/reader-config/reader-config.service';
import { ComicsDetailService } from '../../components/comics-detail/comics-detail.service';
import { KeyboardToolbarService } from '../../components/keyboard-toolbar/keyboard-toolbar.service';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public route: ActivatedRoute,
    public App:AppDataService,
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
    public Prompt: PromptService
  ) {

    this.KeyboardEvent.registerGlobalEvent({
      "p": () => this.KeyboardToolbar.isToggle(),

    })
    this.KeyboardEvent.registerAreaEvent("double_page_reader",{
      "Tab": () => this.KeyboardToolbar.isToggle(),
    })
    // space
    // setTimeout(()=>{
    //   KeyboardToolbar.open()
    // },1000)
    document.body.setAttribute("router", "reader")
    document.body.setAttribute("locked_region", "reader")

    // ReaderConfig.open();
    // this.LoadingCover.open();
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {
      if (params.get('origin')) {
        this.App.setOrigin(params.get('origin'))
        this.data.init();
        this.current._init(params.get('origin'),params.get('id').toString() as string, params.get('sid').toString() as string)
        return
      }
      this.data.init();
      this.current._init(this.App.origin,params.get('id').toString() as string, params.get('sid').toString() as string)

    })
  }

  on($event: MouseEvent) {
    this.current.on$.next($event)
  }
  ngOnDestroy() {
    this.current.close();
  }
  ngAfterViewInit() {
    this.getIsImage();
  }
  close() {

  }

  getIsImage() {
  }


}
