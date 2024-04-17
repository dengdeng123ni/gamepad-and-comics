import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { SetChapterFirstPageCoverService } from './set-chapter-first-page-cover.service';

@Component({
  selector: 'app-set-chapter-first-page-cover',
  templateUrl: './set-chapter-first-page-cover.component.html',
  styleUrls: ['./set-chapter-first-page-cover.component.scss']
})
export class SetChapterFirstPageCoverComponent {
  state = 1; // 1 推断 2 单页封面 3 双页封面
  constructor(
    public current: CurrentService,
    public data: DataService,
    public SetChapterFirstPageCover: SetChapterFirstPageCoverService
  ) {
    this.init();
  }
  async init() {
    const res: any = await this.current._getChapterFirstPageCover(this.data.chapter_id);
    if (res) {
      if (res.is_first_page_cover) {
        this.state = 2;
      } else {
        this.state = 3;
      }
    } else {
      this.state = 1
    }
  }
  change(e: number) {
    if (e == 1) this.current._delChapterFirstPageCover(this.data.chapter_id)
    if (e == 2) this.current._setChapterFirstPageCover(this.data.chapter_id, true)
    if (e == 3) this.current._setChapterFirstPageCover(this.data.chapter_id, false)

    if (this.data.page_index == 0) this.current.event$.next({ key: "double_page_reader_FirstPageToggle", value: null })
    this.close();
  }
  close() {
    this.SetChapterFirstPageCover.close();
  }
}
