import { Component } from '@angular/core';
import { DbControllerService, I18nService, IndexdbControllerService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { ResetReadingProgressService } from './reset-reading-progress.service';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reset-reading-progress',
  templateUrl: './reset-reading-progress.component.html',
  styleUrls: ['./reset-reading-progress.component.scss']
})
export class ResetReadingProgressComponent {

  constructor(
    public i18n: I18nService,
    public data:DataService,
    public current: CurrentService,
    public resetReadingProgress: ResetReadingProgressService,
    public DbController:DbControllerService,
    public webDb: IndexdbControllerService,
  ) {

  }
  async on() {
    const id = this.data.comics_id;
    await this.reset(id);
    this.current._chapterPageChange(this.data.chapters[0].id,0)
    this.resetReadingProgress.close();
  }
  close() {
    this.resetReadingProgress.close();
  }

  async reset(comics_id) {
    const detail = await this.DbController.getDetail(comics_id,{source:this.current.source})
    for (let index = 0; index < detail.chapters.length; index++) {
      const x = detail.chapters[index];
      this.webDb.update("last_read_chapter_page", { 'chapter_id': x.id.toString(), "page_index": 0 })
      if (index == 0) this.webDb.update("last_read_comics", { 'comics_id': comics_id.toString(), chapter_id: detail.chapters[index].id })
    }
  }
}
