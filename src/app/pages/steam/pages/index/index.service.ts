import { Injectable } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ChaptersThumbnailService } from '../../components/chapters-thumbnail/chapters-thumbnail.service';
import { DoublePageThumbnailService } from '../../components/double-page-thumbnail/double-page-thumbnail.service';
import { OnePageThumbnailMode3Service } from '../../components/one-page-thumbnail-mode3/one-page-thumbnail-mode3.service';
import { OnePageThumbnailMode1Service } from '../../components/one-page-thumbnail-mode1/one-page-thumbnail-mode1.service';
import { OnePageThumbnailMode2Service } from '../../components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.service';
import { ReaderChangeService } from '../../components/reader-change/reader-change.service';
import { SetChapterFirstPageCoverService } from '../../components/set-chapter-first-page-cover/set-chapter-first-page-cover.service';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { RoutingControllerService } from 'src/app/library/routing-controller.service';
import { ReaderSectionService } from '../../components/reader-section/reader-section.service';
import { ReaderConfigService } from '../../components/reader-config/reader-config.service';

@Injectable({
  providedIn: 'root',
})
export class IndexService {


  arr = [
    {
      id: "bcak",
      name: "返回",
      click:()=>{
        this.RoutingController.navigate('list')
      }
    },
    {
      id: "toggle_page",
      name: "切页",
      click:()=>{
        this.current.event$.next({ key: "double_page_reader_togglePage", value: null })
      }
    },
    {
      id: "chapters_change",
      name: "章节",
      click:()=>{
        this.chaptersThumbnail.isToggle()
      }
    },
    {
      id: "page_thumbnail",
      name: "缩略图",
      click:()=>{
        if (this.data.comics_config.is_double_page) {
          this.doublePageThumbnail.isToggle();
        } else {
          this.onePageThumbnailMode3.isToggle();
        }
      }
    },
    {
      id: "comics_settings",
      name: "设置",
      click:()=>{
        if (window.innerWidth <= 480) {
          this.ReaderConfig.open_bottom_sheet()
          return
        }
        this.ReaderConfig.open()
      }
    },
    {
      id: "comics_toolbar",
      name: "工具栏",
      click:()=>{
        this.current.readerNavbarBar$.next(true);
      }
    },
    {
      id: "next_page",
      name: "下一页",
      click:()=>{
        this.current._pageNext()
      }
    },
    {
      id: "previous_page",
      name: "上一页",
      click:()=>{
        this.current._pagePrevious()
      }
    },
    {
      id: "next_chapter",
      name: "下一章节",
      click:()=>{
        this.current._chapterNext()
      }
    },
    {
      id: "previous_chapter",
      name: "上一章节",
      click:()=>{
        this.current._chapterPrevious()
      }
    },
    {
      id: "full",
      name: "全屏",
      click:()=>{
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
    }
  ]

  constructor(
    public current: CurrentService,
    public data: DataService,
    public RoutingController:RoutingControllerService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public chaptersThumbnail: ChaptersThumbnailService,
    public onePageThumbnailMode1: OnePageThumbnailMode1Service,
    public onePageThumbnailMode2: OnePageThumbnailMode2Service,
    public onePageThumbnailMode3: OnePageThumbnailMode3Service,
    public ReaderChange: ReaderChangeService,
    public SetChapterFirstPageCover: SetChapterFirstPageCoverService,
    public GamepadEvent: GamepadEventService,
    public ReaderConfig:ReaderConfigService,
    public readerSection:ReaderSectionService,
  ) {


    GamepadEvent.registerConfig('reader', { region: ['double_page_reader', 'page_reader'] });
    GamepadEvent.registerConfig('chapters_thumbnail', {
      region: ['chapters_item'],
    });
    GamepadEvent.registerConfig('double_page_thumbnail', {
      region: ['double_page_thumbnail_item'],
    });

    this.GamepadEvent.registerConfig("reader_navbar_bar", { region: ["reader_navbar_bar_top_item", "reader_navbar_bar_buttom_item"] })
    this.current.on$.subscribe((event$) => {

      const rect = document.body.getBoundingClientRect();
      const x = event$.clientX - rect.left;
      const y = event$.clientY - rect.top;

      const col = Math.floor((x / rect.width) * 3) + 1;
      const row = Math.floor((y / rect.height) * 3) + 1;

      if (col == 1 && row == 1) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[1]);
        if(obj) obj.click()
      }
      if (col == 2 && row == 1) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[2]);
        if(obj) obj.click()
      }
      if (col == 3 && row == 1) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[3]);
        if(obj) obj.click()
      }

      if (col == 1 && row == 2) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[4]);
        if(obj) obj.click()
      }
      if (col == 2 && row == 2) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[5]);
        if(obj) obj.click()
      }
      if (col == 3 && row == 2) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[6]);
        if(obj) obj.click()
      }

      if (col == 1 && row == 3) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[7]);
        if(obj) obj.click()
      }
      if (col == 2 && row == 3) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[8]);
        if(obj) obj.click()
      }
      if (col == 3 && row == 3) {
        const obj= this.arr.find(x=>x.id==this.data.nine_grid[9]);
        if(obj) obj.click()
      }
      return

    });
  }
  back() {
    window.history.back();
  }
  firstPageCoverChange() {
    this.current.event$.next({
      key: 'double_page_reader_FirstPageToggle',
      value: null,
    });
  }
  togglePage() {
    this.current.event$.next({
      key: 'double_page_reader_togglePage',
      value: null,
    });
  }
  togglePage2() {
    this.current.event$.next({
      key: 'left_right_page_reader_togglePage',
      value: null,
    });
  }
  previous() {
    this.current._chapterPrevious();
  }
  next() {
    this.current._chapterNext();
  }
}
