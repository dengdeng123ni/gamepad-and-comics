import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { GlobalSettingsService } from '../global-settings/global-settings.service';
import { LanguageSettingsService } from '../language-settings/language-settings.service';
import { ListSettingsService } from '../list-settings/list-settings.service';
import { SoftwareInformationService } from '../software-information/software-information.service';
import { UploadSelectService } from '../upload-select/upload-select.service';

@Component({
  selector: 'app-list-side',
  templateUrl: './list-side.component.html',
  styleUrls: ['./list-side.component.scss']
})
export class ListSideComponent {


  constructor
    (
      public current: CurrentListService,
      public config:ConfigListService,
      public uploadSelect: UploadSelectService,
      public i18n:I18nService,
      public LanguageSettings:LanguageSettingsService,
      public SoftwareInformation:SoftwareInformationService,
      public globalSettings:GlobalSettingsService,
      public listSettings:ListSettingsService
    ) {

  }
  uploadSelectOpen($event) {
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = (position.y + (position.height / 2)) - (openTargetHeight / 2);
    this.uploadSelect.open({ x, y });
  }
  editIsToggle($event){
    this.config.edit=!this.config.edit;
    this.current.edit$.next(this.config.edit);
  }
  openSoftwareInformation($event){
    const node = ($event.target as HTMLElement);
    const position = node.getBoundingClientRect();
    const openTargetHeight = 36;
    const x = window.innerWidth - (position.x - 15);
    const y = window.innerHeight -position.y -position.height;
     this.SoftwareInformation.open({
      position:{ bottom:`${y}px`, right:`${x}px` },
      delayFocusTrap:false,
      panelClass:"reader_settings_right",
      backdropClass:"reader_settings_right_backdrop",
     })
  }
  openGlobalSettings($event){
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = window.innerWidth-x;
    y = (window.innerHeight) - y-height;
    this.globalSettings.open({
      position: {
        bottom: `${y}px`,
        right: `${x}px`
      },
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop",
    })
  }
  openListSettings($event){
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = window.innerWidth-x;
    // y = (window.innerHeight) - y-height;
    this.listSettings.open({
      position: {
        top: `${y}px`,
        right: `${x}px`
      },
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop",
    })
  }
}
