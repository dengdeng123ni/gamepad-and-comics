import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { CurrentDetailService } from '../../services/current.service';

@Component({
  selector: 'app-detail-settings',
  templateUrl: './detail-settings.component.html',
  styleUrls: ['./detail-settings.component.scss']
})
export class DetailSettingsComponent {
  constructor(
    public current: CurrentDetailService,
    public i18n: I18nService,
    ) {

  }
}
