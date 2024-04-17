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
import { EventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  constructor(
    public current: CurrentService,
    public data: DataService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public chaptersThumbnail: ChaptersThumbnailService,
    public onePageThumbnailMode1: OnePageThumbnailMode1Service,
    public onePageThumbnailMode2: OnePageThumbnailMode2Service,
    public onePageThumbnailMode3: OnePageThumbnailMode3Service,
    public ReaderChange: ReaderChangeService,
    public SetChapterFirstPageCover: SetChapterFirstPageCoverService,
    public GamepadEvent: GamepadEventService,
    public Event: EventService
  ) {
    GamepadEvent.registerConfig('reader', { region: ['double_page_reader'] });
    GamepadEvent.registerConfig('chapters_thumbnail', {
      region: ['chapter_item'],
    });
    GamepadEvent.registerConfig('double_page_thumbnail', {
      region: ['double_page_thumbnail_item'],
    });

    this.current.on$.subscribe((event$) => {
      const { x, y } = event$;
      const { innerWidth, innerHeight } = window;
      if (
        x > innerWidth * 0.33 &&
        x < innerWidth * 0.66 &&
        y > innerHeight * 0.33 &&
        y < innerHeight * 0.66
      ) {
        this.current.readerNavbarBar$.next(true);
      } else if (
        x > innerWidth * 0.33 &&
        x < innerWidth * 0.66 &&
        y > innerHeight * 0 &&
        y < innerHeight * 0.33
      ) {
        if (data.comics_config.is_double_page) {
          this.doublePageThumbnail.isToggle();
        } else {
          this.onePageThumbnailMode3.isToggle();
        }
      } else if (
        x > innerWidth * 0.33 &&
        x < innerWidth * 0.66 &&
        y > innerHeight * 0.66 &&
        y < innerHeight * 1
      ) {
        this.chaptersThumbnail.isToggle();
      } else {
        if (x < innerWidth / 2) {
          this.current._change('previousPage', {
            pages: this.data.pages,
            page_index: this.data.page_index,
            chapter_id: this.data.chapter_id,
          });
        } else {
          this.current._change('nextPage', {
            pages: this.data.pages,
            page_index: this.data.page_index,
            chapter_id: this.data.chapter_id,
          });
        }
      }
    });
    Event.register('double_page_thumbnail', {
      icon: 'grid_view',
      name: '双页缩略图',
      router: 'reader',
      event: () => doublePageThumbnail.isToggle(),
      shortcut_key: {
        gamepad: {
          position: 'center',
          index: 2,
        },
      },
    });
    Event.register('one_page_thumbnail_list', {
      name: '单页列表缩略图',
      icon: 'view_comfy',
      router: 'reader',
      event: () => onePageThumbnailMode1.isToggle,
    });
    Event.register('one_page_thumbnail_left', {
      name: '单页左侧缩略图',
      icon: 'view_sidebar',
      router: 'reader',
      event: () => onePageThumbnailMode2.isToggle,
    });
    Event.register('double_page_thumbnail_bottom', {
      name: '单页下方缩略图',
      icon: 'vertical_split',
      router: 'reader',
      event: () => onePageThumbnailMode3.isToggle,
    });
    Event.register('toolbar', {
      name: '工具栏',
      icon: 'view_day',
      router: 'reader',
      event: () => this.current.readerNavbarBar$.next(true),
    });
    Event.register('chapters_previous', {
      name: '上一章',
      icon: 'chevron_left',
      router: 'reader',
      event: () => this.previous,
    });
    Event.register('chapters_next', {
      name: '下一章',
      icon: 'chevron_right',
      router: 'reader',
      event: () => this.next,
    });
    Event.register('chapters_thumbnail', {
      name: '章节列表',
      icon: 'subject',
      router: 'reader',
      event: () => chaptersThumbnail.isToggle(),
      shortcut_key: {
        gamepad: {
          position: 'center',
          index: 1,
        },
      },
    });
    Event.register('toggle_page', {
      name: '跨页匹配',
      icon: 'swap_horiz',
      router: 'reader',
      event: () => this.togglePage,
    });

    Event.register('back', {
      name: '返回',
      icon: 'keyboard_return',
      router: 'reader',
      event: () => this.back,
    });
    Event.register('chrome_reader_mode', {
      name: '阅读模式',
      icon: 'chrome_reader_mode',
      router: 'reader',
      event: () => ReaderChange.isToggle(),
    });

    Event.register('double_page_first_page_toggle', {
      name: '设置第一页为封面',
      icon: 'radio_button_checked',
      router: 'reader',
      event: () => this.firstPageCoverChange,
    });
    Event.register('page_previous', {
      name: '上一页',
      icon: 'first_page',
      router: 'reader',
      event: () => this.current._pagePrevious(),
    });
    Event.register('page_next', {
      name: '下一页',
      icon: 'last_page',
      router: 'reader',
      event: () => this.current._pageNext(),
    });
    Event.register('full', {
      name: '全屏',
      icon: 'fullscreen',
      router: 'reader',
      event: () => this.current._pageNext(),
    });
    Event.register('chapters_list', {
      name: '(小)章节列表',
      icon: 'subject',
      router: 'reader',
      event: () => this.current._pageNext(),
    });
    Event.register('rotation', {
      name: '旋转',
      icon: 'screen_rotation',
      router: 'reader',
      event: () => this.current._pageNext(),
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
