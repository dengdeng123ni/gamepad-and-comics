import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss']
})
export class ListSettingsComponent {
   constructor(
    public i18n:I18nService,
    public config:ConfigListService
    ){

   }

   ngOnDestroy(){
    localStorage.setItem("comics_item_size", this.config.page.comics_item_size)
    localStorage.setItem("comics_is_page", this.config.page.is_page.toString())
   }
}
