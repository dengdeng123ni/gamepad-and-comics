import { Injectable } from '@angular/core';
import { GlobalSettingsService } from '../components/global-settings/global-settings.service';
import { LanguageSettingsService } from '../components/language-settings/language-settings.service';
import { ListSettingsService } from '../components/list-settings/list-settings.service';
import { SoftwareInformationService } from '../components/software-information/software-information.service';
import { UploadSelectService } from '../components/upload-select/upload-select.service';
import { GamepadEventService, I18nService } from 'src/app/library/public-api';
import { CurrentListService } from './current.service';
import { ConfigListService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    public uploadSelect: UploadSelectService,
    public LanguageSettings: LanguageSettingsService,
    public SoftwareInformation: SoftwareInformationService,
    public globalSettings: GlobalSettingsService,
    public listSettings: ListSettingsService,
    public GamepadEvent: GamepadEventService,
    public current: CurrentListService,
    public config:ConfigListService,
    public i18n:I18nService
  )
  {
  }
  // list_menu_item list_mode_item list_toolabr_item
  // back continue detail_toolabr_item section_item
  // reader_mode_1 reader_mode_2 reader_mode_3 reader_mode_4
}
