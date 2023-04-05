import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';
import { DetailSettingsService } from '../detail-settings/detail-settings.service';
import { OnePageThumbnailService } from '../one-page-thumbnail/one-page-thumbnail.service';

@Component({
  selector: 'app-detail-side',
  templateUrl: './detail-side.component.html',
  styleUrls: ['./detail-side.component.scss']
})
export class DetailSideComponent {
  constructor(
    public config:ConfigDetailService,
    public current: CurrentDetailService,
    public i18n:I18nService,
    public onePageThumbnail:OnePageThumbnailService,
    public detailSettings:DetailSettingsService
  ) {


  }
  editIsToggle(){
    this.config.edit=!this.config.edit;
    this.current.edit$.next(this.config.edit);
  }
  openSettings($event) {
    // readerSettings.open_bottom_sheet({});
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = window.innerWidth-x+8;
    y = (window.innerHeight) - (y+height/2) -54;
    this.detailSettings.open({
      position: {
        bottom: `${y}px`,
        right: `${x}px`
      },
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop",
    })
  }
}
