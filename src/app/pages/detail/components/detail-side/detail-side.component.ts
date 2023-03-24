import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';

@Component({
  selector: 'app-detail-side',
  templateUrl: './detail-side.component.html',
  styleUrls: ['./detail-side.component.scss']
})
export class DetailSideComponent {
  constructor(
    public config:ConfigDetailService,
    public current: CurrentDetailService,
    public i18n:I18nService
  ) {


  }
  editIsToggle(){
    this.config.edit=!this.config.edit;
    this.current.edit$.next(this.config.edit);
  }
}
