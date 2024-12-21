import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { ChaptersThumbnailService } from '../chapters-thumbnail/chapters-thumbnail.service';
import { OnePageThumbnailMode1Service } from '../one-page-thumbnail-mode1/one-page-thumbnail-mode1.service';
import { OnePageThumbnailMode2Service } from '../one-page-thumbnail-mode2/one-page-thumbnail-mode2.service';
import { OnePageThumbnailMode3Service } from '../one-page-thumbnail-mode3/one-page-thumbnail-mode3.service';
import { ReaderChangeService } from '../reader-change/reader-change.service';
import { SetChapterFirstPageCoverService } from '../set-chapter-first-page-cover/set-chapter-first-page-cover.service';
import { ReaderConfigService } from '../reader-config/reader-config.service';
import { ComicsDetailService } from '../comics-detail/comics-detail.service';
import { ContextMenuEventService, DbControllerService, IndexdbControllerService, RoutingControllerService } from 'src/app/library/public-api';

import { ResetReadingProgressService } from '../reset-reading-progress/reset-reading-progress.service';
import { FilterService } from '../filter/filter.service';
import { ExportSettingsService } from '../export-settings/export-settings.service';
import { ChaptersFirstCoverSettingsService } from '../chapters-first-cover-settings/chapters-first-cover-settings.service';
import { RepliesPageService } from '../replies-page/replies-page.service';
import { SettingsNineGridService } from '../settings-nine-grid/settings-nine-grid.service';

@Component({
  selector: 'app-reader-toolbar',
  templateUrl: './reader-toolbar.component.html',
  styleUrls: ['./reader-toolbar.component.scss']
})
export class ReaderToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  isMobile = (navigator as any).userAgentData.mobile;
  is_locked = true;
  double_page_reader: any = {}


  arr = [];
  get color() { return this.data.comics_config.background_color };
  set color(e: string) {
    this.data.comics_config.background_color = e;
    document.documentElement.style.setProperty('--reader-background-color', this.data.comics_config.background_color)

  }

  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public chaptersThumbnail: ChaptersThumbnailService,
    public onePageThumbnailMode1: OnePageThumbnailMode1Service,
    public onePageThumbnailMode2: OnePageThumbnailMode2Service,
    public onePageThumbnailMode3: OnePageThumbnailMode3Service,
    public SetChapterFirstPageCover: SetChapterFirstPageCoverService,
    public ReaderChange: ReaderChangeService,
    public ReaderConfig: ReaderConfigService,
    public ComicsDetail: ComicsDetailService,
    public ChaptersFirstCoverSettings: ChaptersFirstCoverSettingsService,
    public DbController: DbControllerService,
    public webDb: IndexdbControllerService,
    public filter: FilterService,
    public resetReadingProgress: ResetReadingProgressService,
    public ExportSettings: ExportSettingsService,
    public ContextMenuEvent: ContextMenuEventService,
    public RoutingController: RoutingControllerService,
     public SettingsNineGrid: SettingsNineGridService,
    public RepliesPage: RepliesPageService
  ) {
    let menu = [
      {
        id: "bcak",
        name: "返回",
        click: e => {
          this.RoutingController.navigate('list')
        }
      },
      {
        id: "toggle_page",
        name: "切页",
        click: e => {
          this.togglePage()
        }
      },
      {
        id: "fiast_page",
        name: "设置第一页封面",
        click: e => {
          this.ChaptersFirstCoverSettings.open();
        }
      },
      {
        id: "chapters_thumbnail",
        name: "章节",
        click: e => {
          this.chaptersThumbnail.isToggle()
        }
      },

      {
        id: "double_page_thumbnail",
        name: "双页缩略图",
        click: e => {
          this.doublePageThumbnail.isToggle();
        }
      },
      {
        id: "one_page_thumbnail",
        name: "单页缩略图",
        click: e => {
          this.onePageThumbnailMode3.isToggle();
        }
      },
      {
        id: "filter",
        name: "滤镜",
        click: e => {

          const left = ((window.innerWidth / 2) - e.clientX > 0)
          const top = ((window.innerHeight / 2) - e.clientY > 0)
          let position = {};
          position[left ? 'left' : 'right'] = left ? `${e.clientX}px` : `${(window.innerWidth - e.clientX)}px`
          position[top ? 'top' : 'bottom'] = top ? `${e.clientY}px` : `${(window.innerHeight - e.clientY)}px`
          this.filter.open({
            backdropClass: "_reader_config_bg",
            position: position
          });

        }
      },
      {
        id: "resetReading",
        name: "重置阅读进度",
        click: e => {
         this.resetReadingProgress.isToggle()

        }
      },
      {
        id: "settings",
        name: "设置",
        click: e => {
          const left = ((window.innerWidth / 2) - e.clientX > 0)
          const top = ((window.innerHeight / 2) - e.clientY > 0)
          let position = {};
          position[left ? 'left' : 'right'] = left ? `${e.clientX}px` : `${(window.innerWidth - e.clientX)}px`
          position[top ? 'top' : 'bottom'] = top ? `${e.clientY}px` : `${(window.innerHeight - e.clientY)}px`
          this.ReaderConfig.open( )
        }
      },


    ];
    if (data.is_download) {
      menu.push({
        id: "export_settings",
        name: "下载",
        click: e => {

          const left = ((window.innerWidth / 2) - e.clientX > 0)
          const top = ((window.innerHeight / 2) - e.clientY > 0)
          let position = {};
          position[left ? 'left' : 'right'] = left ? `${e.clientX}px` : `${(window.innerWidth - e.clientX)}px`
          position[top ? 'top' : 'bottom'] = top ? `${e.clientY}px` : `${(window.innerHeight - e.clientY)}px`
          this.ExportSettings.open({
            backdropClass: "_reader_config_bg",
            position: position
          });

        }
      })
    } else {
      ContextMenuEvent.logoutMenu('comics_reader', 'export_settings')
      ContextMenuEvent.logoutMenu('pages_item', 'export_settings')
    }
    menu.push({
      id: "full",
      name: "全屏",
      click: e => {
        this.isFullChange();
      }
    })

    ContextMenuEvent.register('comics_reader', {
      on: async (e: any) => {
        e.click(e.PointerEvent)
      },
      menu: menu
    })
    ContextMenuEvent.register('pages_item', {
      on: async (e: any) => {
        e.click(e.PointerEvent)
      },
      menu: menu
    })

    current.init$.subscribe(x => {
      if (this.data.chapters[0].is_locked === undefined || !this.data.is_locked) this.is_locked = false;

    })
  }
  filterOpen($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    this.filter.open({ backdropClass: "_reader_config_bg", position: { right: "30px", top: `${position.top}px` } })
  }
  menuObj: {
    list: any,
    type: string
  } = {
      list: [],
      type: "delete"
    }
  back() {
    window.history.back()
  }
  routerList() {
    this.RoutingController.navigate('list')
  }
  firstPageCoverChange() {
    this.current.event$.next({ key: "double_page_reader_FirstPageToggle", value: null })
  }
  on_input_color(e) {
    (document.querySelector("#background_input_color") as any).click();
  }

  imageRotation() {
    const node: any = document.querySelector(".swiper-wrapper")
    const rotate = node.getAttribute("rotate");
    const nodes: any = document.querySelectorAll(".swiper-slide-active img")
    if (nodes.length == 1) {
      const scale = (nodes[0].height / nodes[0].width)
      if (rotate == "90") {
        node.style = `transform: rotate(180deg) scale(1);`;
        node.setAttribute("rotate", "180")
      } else if (rotate == "180") {
        node.style = `transform: rotate(270deg) scale(${scale});`;
        node.setAttribute("rotate", "270")
      }
      else if (rotate == "270") {
        node.style = "";
        node.setAttribute("rotate", "")
      } else {
        node.style = `transform: rotate(90deg) scale(${scale});`;
        node.setAttribute("rotate", "90")
      }
    } else if (nodes.length == 2) {
      const scale = ((nodes[0].height + nodes[1].height) / 2 / (nodes[0].width + nodes[1].width))
      if (rotate == "90") {
        node.style = `transform: rotate(180deg) scale(1);`;
        node.setAttribute("rotate", "180")
      } else if (rotate == "180") {
        node.style = `transform: rotate(270deg) scale(${scale});`;
        node.setAttribute("rotate", "270")
      }
      else if (rotate == "270") {
        node.style = "";
        node.setAttribute("rotate", "")
      } else {
        node.style = `transform: rotate(90deg) scale(${scale});`;
        node.setAttribute("rotate", "90")
      }
    }

  }
  separatePage() {

  }
  mergePage() {

  }
  insertPage() {

  }
  openDeleteMenu($event: MouseEvent) {

  }
  openReplies(e) {
    this.RepliesPage.open();
  }
  closeMenu() {
    if (this.menuObj.type == "list") {
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_section")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    } else if (this.menuObj.type == "delete") {
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_page")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    }

  }
  openList($event: MouseEvent) {
    this.menuObj.type = "list"
    const node_reader_toolbar: any = document.querySelector("#reader_toolbar_section")
    node_reader_toolbar.style.opacity = 1;
    this.menuObj.list = [];
    this.menuObj.list = this.data.chapters;
    const p = ($event.target as any).getBoundingClientRect();
    let node = (document.getElementById(`reader_toolbar_menu`) as any);
    node.style.top = `${this.menuObj.list.length < 3 ? p.top : p.bottom}px`;
    node.style.left = `${p.x + p.width + 4}px`;
    setTimeout(() => {
      this.menu.openMenu();
      setTimeout(() => {
        const node: any = document.querySelector(`[_id=_menu_item_${this.data.chapter_id}]`)
        node!.scrollIntoView({ block: "center", inline: "center" })
        if (node) node?.focus()
      }, 0)
    }, 0)

  }
  onItem(id: string) {
    this.current._chapterChange(id);
  }
  togglePage() {
    this.current.event$.next({ key: "double_page_reader_togglePage", value: null })
  }
  togglePage2() {
    this.current.event$.next({ key: "left_right_page_reader_togglePage", value: null })
  }
  previous() {
    this.current._chapterPrevious();
  }
  next() {
    this.current._chapterNext();
  }

  isFullChange() {
    this.isfullscreen = !this.isfullscreen
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  }

  openReaderChangeView($event: any) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = (window.innerHeight - 512) / 2;
    // this.uploadSelect.open({ x, y });
    this.ReaderChange.open({ top: `${y}px`, right: `${x}px` })
  }
  openFirstPageCoverChangeView($event: any) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = (window.innerHeight - 512) / 2;
    // this.uploadSelect.open({ x, y });
    this.SetChapterFirstPageCover.open({ position: { top: `${y}px`, left: `${70}px` }, delayFocusTrap: false, })
  }


  openReaderSettings($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    this.ReaderConfig.open({ right: "30px", top: `${position.top}px` })
  }

  openExportSettings($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    this.ExportSettings.open({ position: { right: "30px", bottom: `${30}px` } })
  }

  OpenComicsDetail($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    this.ComicsDetail.open({ right: "30px", bottom: `30px` })
  }



}
