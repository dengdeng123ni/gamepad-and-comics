import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/library/public-api';
import { LanguageSettingsService } from './language-settings.service';
@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    public anguageSettings:LanguageSettingsService,
    public i18n:I18nService,
    private http: HttpClient) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    const language=localStorage.getItem("language")
    const node:any=document.querySelector(`[_id=language_setting_${language}]`)
    node.focus();
  }
  use(language){
    localStorage.setItem("language",language)
    this.translate.use(language).subscribe(c => {
      this.i18n.config = c;
      document.title=c.gamepad_and_comics;
    });;
    this.anguageSettings.close();
  }
}
