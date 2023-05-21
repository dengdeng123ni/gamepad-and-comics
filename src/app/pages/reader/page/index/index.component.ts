import { Component, HostListener, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { ContextMenuEventService, GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { DoublePageThumbnailService } from '../../components/double-page-thumbnail/double-page-thumbnail.service';
import { GamepadThumbnailService } from '../../components/gamepad-thumbnail/gamepad-thumbnail.service';
import { HandleLeftCircleToolbarService } from '../../components/handle-left-circle-toolbar/handle-left-circle-toolbar.service';
import { ModeChangeService } from '../../components/mode-change/mode-change.service';
import { ReaderNavbarBarService } from '../../components/reader-navbar-bar/reader-navbar-bar.service';
import { ReaderSettingsService } from '../../components/reader-settings/reader-settings.service';
import { SectionService } from '../../components/section/section.service';
import { SidebarLeftService } from '../../components/sidebar-left/sidebar-left.service';
import { SlideBottomService } from '../../components/slide-bottom/slide-bottom.service';
import { ThumbnailBottomService } from '../../components/thumbnail-bottom/thumbnail-bottom.service';
import { ThumbnailService } from '../../components/thumbnail-list/thumbnail.service';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { PromptService } from '../../services/prompt.service';
import { ReaderAutoService } from '../../components/reader-auto/reader-auto.service';
import { SquareThumbnailService } from '../../components/square-thumbnail/square-thumbnail.service';
import { ChapterHistoryService } from '../../components/chapter-history/chapter-history.service';
import { RegisterService } from '../../services/register.service';
import { ThumbnailSelectService } from '../../components/thumbnail-select/thumbnail-select.service';

@Component({
  selector: 'app-reader-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexReaderComponent {

  constructor
    (
      public current: CurrentReaderService,
      public config: ConfigReaderService,
      private zone: NgZone,
      private route: ActivatedRoute,
      public router:Router,
      public thumbnail: ThumbnailService,
      public slideBottom: SlideBottomService,
      public left: SidebarLeftService,
      public ModeChange: ModeChangeService,
      public section: SectionService,
      public thumbnailBottom: ThumbnailBottomService,
      public HandleLeftCircleToolbar: HandleLeftCircleToolbarService,
      public readerSettings: ReaderSettingsService,
      public GamepadController: GamepadControllerService,
      public GamepadEvent: GamepadEventService,
      public ContextMenuEvent: ContextMenuEventService,
      public ReaderNavbarBar: ReaderNavbarBarService,
      public gamepadThumbnail: GamepadThumbnailService,
      public squareThumbnail: SquareThumbnailService,
      public doublePageThumbnail: DoublePageThumbnailService,
      public readerAuto: ReaderAutoService,
      public prompt: PromptService,
      public chapterHistory: ChapterHistoryService,
      public thumbnailSelect:ThumbnailSelectService,
      public register:RegisterService
    ) {

    GamepadEvent.registerConfig("reader", { region: ["reader_mode_1","reader_mode_2","reader_mode_3","reader_mode_4"] })

    GamepadEvent.registerVoice({ region:"reader", key:"back_index", keywords:["首页"], event:()=> router.navigate(['/'])})

    GamepadEvent.registerVoice({ region:"reader", key:"settings", keywords:["设置"], event:()=> readerSettings.open()})

    GamepadEvent.registerVoice({ region:"reader", key:"next_page", keywords:["下一页"], event:()=>current.nextPage$.next(true)})
    GamepadEvent.registerVoice({ region:"reader", key:"previous_page", keywords:["上一页"], event:()=>current.previousPage$.next(true)})

    GamepadEvent.registerVoice({ region:"reader", key:"next_section", keywords:["下一章","下一话"], event:()=> current.next()})
    GamepadEvent.registerVoice({ region:"reader", key:"previous_seciton", keywords:["上一章","上一话"], event:()=>current.previous()})


    GamepadEvent.registerVoice({ region:"reader", key:"all_section", keywords:["全部章节"], event:()=>section.open()})
    GamepadEvent.registerVoice({ region:"reader", key:"double_page_thumbnail", keywords:["缩略图"], event:()=>doublePageThumbnail.open({ id: this.current.comics.chapter.id, index: this.current.comics.chapter.index }) })



    document.body.setAttribute("locked_region","reader")
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    id$.subscribe(x => this.current.init(x))
    this.current.mode$.subscribe(x => {
      this.current.comics.mode = x;
      this.config.mode = x;
      this.current.update_state(this.current.comics.chapter, this.current.comics.chapter.index)
    })
    GamepadEvent.registerGlobalEvent({
      "LEFT_ANALOG_PRESS": () => {
        this.HandleLeftCircleToolbar.isToggle();
      },
    })

    const reader_mode_names = ["reader_mode_1", "reader_mode_2", "reader_mode_3", "reader_mode_4"]
    reader_mode_names.forEach(name => {
      GamepadEvent.registerAreaEventY(name, {
        "LEFT": () => this.thumbnail.isToggle(),
        "UP": () => this.squareThumbnail.open(),
        "DOWN": () => this.section.isToggle(),
        "RIGHT": () => this.doublePageThumbnail.open({
          id: this.current.comics.chapter.id,
          index: this.current.comics.chapter.index
        }),
      })
    })
    // this.gamepadThumbnail.open({
    //   id: this.current.comics.chapter.id,
    //   index: this.current.comics.chapter.index
    // })
    const names = ["thumbnail_sidebar_bottom", "thumbnail_sidebar_left", "thumbnail_list", "square_thumbnail"]
    names.forEach(name => {
      ContextMenuEvent.register(name, {
        on: e => {
          if (e.id == "delete") {
            const id = parseInt(e.value);
            this.current.deletePage(this.current.comics.id, this.current.comics.chapter.id, id)
          } else if (e.id == "insertPageBefore") {
            const id = parseInt(e.value);
            this.current.insertPage(this.current.comics.id, this.current.comics.chapter.id, id, "", "before")
          } else if (e.id == "insertPageAfter") {
            const id = parseInt(e.value);
            this.current.insertPage(this.current.comics.id, this.current.comics.chapter.id, id, "", "after")
          }
        },
        menu: [
          {
            name: "insert_page", "id": "insertPage", submenu: [
              {
                name: "before", id: "insertPageBefore",
              },
              {
                name: "after", id: "insertPageAfter",
              }
            ],
          },
          { name: "delete", id: "delete" },
        ]
      })
    })
    // this.readerSettings.open();
    // this.HandleLeftCircleToolbar.open();
  }
  on($event) {
    this.current.on$.next($event)
  }

  ngOnDestroy() {
    this.config.close();
    this.current.close();
  }


}
