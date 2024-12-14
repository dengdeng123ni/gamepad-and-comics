import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { LanguageSettingsService } from './language-settings.service';
@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent  {

  constructor(
    public anguageSettings:LanguageSettingsService,
    public i18n:I18nService,
    private http: HttpClient) { }

  ngAfterViewInit() {
    const language=localStorage.getItem("language")
    const node:any=document.querySelector(`[_id=language_setting_${language}]`)
    node.focus();
  }
  use(language){
    localStorage.setItem("language",language)

  }
}
