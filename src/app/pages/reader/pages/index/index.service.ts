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
        if(y < innerHeight * 0.05){
         window.history.back()
         return
        }
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
          // this.current._change('previousPage', {
          //   page_index: this.data.page_index,
          //   chapter_id: this.data.chapter_id,
          // });
        } else {
          // this.current._change('nextPage', {
          //   page_index: this.data.page_index,
          //   chapter_id: this.data.chapter_id,
          // });
        }
      }
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
