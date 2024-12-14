import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { LanguageSettingsService } from './language-settings.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent  {

  constructor(
    public anguageSettings:LanguageSettingsService,
    public i18n:I18nService,
    private translate: TranslateService,
    private http: HttpClient) { }

  ngAfterViewInit() {

  }
  use(language){
    localStorage.setItem("language",language)
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }
}
