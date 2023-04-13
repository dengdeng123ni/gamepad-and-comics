import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { CurrentDetailService } from '../../services/current.service';
import { ResetReadingProgressService } from './reset-reading-progress.service';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-reset-reading-progress',
  templateUrl: './reset-reading-progress.component.html',
  styleUrls: ['./reset-reading-progress.component.scss']
})
export class ResetReadingProgressComponent {
  constructor(public i18n: I18nService,
    public current: CurrentDetailService,
    public resetReadingProgress: ResetReadingProgressService,
    public loading:LoadingService
  ) {

  }
  async on() {
    const id = this.current.comics.id;
    this.loading.open();
    await this.current.resetReadingProgress(id);
    await this.current.init(id);
    this.loading.close();
  }
  close() {
    this.resetReadingProgress.close();
  }
}
