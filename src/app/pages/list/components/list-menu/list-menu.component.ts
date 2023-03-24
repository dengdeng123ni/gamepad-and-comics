import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent {
  constructor(public i18n:I18nService,) { }
  on(e, x) {

  }
}
