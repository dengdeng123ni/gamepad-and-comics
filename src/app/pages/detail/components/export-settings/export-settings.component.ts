import { Component } from '@angular/core';
import { CurrentDetailService } from '../../services/current.service';
import { ExportSettingsService } from './export-settings.service';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent {
  constructor(
    public exportSettings: ExportSettingsService,
    public current: CurrentDetailService
  ) { }
  pageOrder = false;
  isFirstPageCover = false;
  page = "double"; //  double one
  type = "PDF";
  change(e) {
    this.page = e;
  }

  on($event) {
    if (this.page == "double") {
      this.current.onDownloadClick$.next({
        $event, data: {
          pageOrder: this.pageOrder,
          isFirstPageCover: this.isFirstPageCover,
          page: this.page,
          type: this.type
        }
      })
    }
    if (this.page == "one") {
      this.current.onDownloadClick$.next({
        $event, data: {
          page: this.page,
          type: this.type
        }
      })
    }
  }
}
