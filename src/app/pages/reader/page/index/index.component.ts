import { Component, HostListener, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
      public gamepadThumbnail:GamepadThumbnailService,
      public squareThumbnail:SquareThumbnailService,
      public doublePageThumbnail:DoublePageThumbnailService,
      public readerAuto:ReaderAutoService,
      public prompt:PromptService
    ) {

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
    GamepadEvent.registerAreaEventY("reader_mode_1", {
      "LEFT": () => this.gamepadThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
      "UP": () => this.squareThumbnail.open(),
      "RIGHT": () => this.doublePageThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
    })
    GamepadEvent.registerAreaEventY("reader_mode_2", {

      "UP": () => this.squareThumbnail.open(),
      "LEFT": () => this.gamepadThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
      "RIGHT": () => this.doublePageThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
    })
    GamepadEvent.registerAreaEventY("reader_mode_3", {

      "UP": () => this.squareThumbnail.open(),
      "LEFT": () => this.gamepadThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
      "RIGHT": () => this.doublePageThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
    })
    GamepadEvent.registerAreaEventY("reader_mode_4", {

      "UP": () => this.squareThumbnail.open(),
      "LEFT": () => this.gamepadThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
      "RIGHT": () => this.doublePageThumbnail.open({
        id:this.current.comics.chapter.id,
        index:this.current.comics.chapter.index
      }),
    })
    const names = ["thumbnail_sidebar_bottom", "thumbnail_sidebar_left", "thumbnail_list","square_thumbnail"]
    names.forEach(name => {
      ContextMenuEvent.register(name, {
        on: e => {
          if (e.id == "delete") {
            const id = parseInt(e.value);
            this.current.deletePage(this.current.comics.id, this.current.comics.chapter.id, id)
          }else if(e.id=="insertPageBefore"){
            const id = parseInt(e.value);
            this.current.insertPage(this.current.comics.id, this.current.comics.chapter.id, id,"","before")
          }else if(e.id=="insertPageAfter"){
            const id = parseInt(e.value);
            this.current.insertPage(this.current.comics.id, this.current.comics.chapter.id, id,"","after")
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
