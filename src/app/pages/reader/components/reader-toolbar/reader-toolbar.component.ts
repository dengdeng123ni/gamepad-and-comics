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
import { ComicsSettingsService } from '../comics-settings/comics-settings.service';
import { DbControllerService, RoutingControllerService } from 'src/app/library/public-api';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { ResetReadingProgressService } from '../reset-reading-progress/reset-reading-progress.service';
import { FilterService } from '../filter/filter.service';

@Component({
  selector: 'app-reader-toolbar',
  templateUrl: './reader-toolbar.component.html',
  styleUrls: ['./reader-toolbar.component.scss']
})
export class ReaderToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  isMobile = (navigator as any).userAgentData.mobile;
  is_locked=true;
  double_page_reader: any = {}
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public chaptersThumbnail: ChaptersThumbnailService,
    public onePageThumbnailMode1: OnePageThumbnailMode1Service,
    public onePageThumbnailMode2: OnePageThumbnailMode2Service,
    public onePageThumbnailMode3: OnePageThumbnailMode3Service,
    public SetChapterFirstPageCover:SetChapterFirstPageCoverService,
    public ReaderChange: ReaderChangeService,
    public ReaderConfig:ReaderConfigService,
    public ComicsDetail:ComicsDetailService,
    public ComicsSettings:ComicsSettingsService,
    public DbController:DbControllerService,
    public webDb: NgxIndexedDBService,
    public filter:FilterService,
    public resetReadingProgress:ResetReadingProgressService,
    public RoutingController:RoutingControllerService
  ) {
    current.init$.subscribe(x=>{
      if (this.data.chapters[0].is_locked === undefined || !this.data.is_locked) this.is_locked = false;

    })
  }
  filterOpen($event){
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    this.filter.open({backdropClass:"_reader_config_bg",position:{right:"30px",top:`${position.top}px`}})
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

  imageRotation() {
    const node: any = document.querySelector(".swiper-slide-active")
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
      setTimeout(()=>{
        const node:any= document.querySelector(`[_id=_menu_item_${this.data.chapter_id}]`)
        node!.scrollIntoView({ block: "center", inline: "center" })
        if(node) node?.focus()
      },0)
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
    this.SetChapterFirstPageCover.open({position:{ top: `${y}px`, left: `${70}px` },delayFocusTrap:false,})
  }


  openReaderSettings($event){
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    this.ReaderConfig.open({right:"30px",top:`${position.top}px`})
  }

  OpenComicsDetail($event){
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    this.ComicsDetail.open({right:"30px",bottom:`30px`})
  }



}
