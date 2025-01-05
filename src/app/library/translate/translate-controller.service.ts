import { Inject, Injectable } from '@angular/core';
import { TranslateEventService } from '../public-api';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';


import 'moment/locale/fr';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import 'moment/locale/de';
import 'moment/locale/zh-cn';
import 'moment/locale/pt';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/ja';
import 'moment/locale/ko';
import 'moment/locale/it';
import 'moment/locale/tr';
import 'moment/locale/hu';

@Injectable({
  providedIn: 'root'
})
export class TranslateControllerService {

  constructor(public TranslateEvent: TranslateEventService,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {


  }

  getTranslation(key) {
    if (key=="en") {
      this._locale = "en-gb";
      this._adapter.setLocale(this._locale);
    }else if(key=="zh"){
      this._locale = "zh-cn";
      this._adapter.setLocale(this._locale);
    }else {
      this._locale = key;
      this._adapter.setLocale(this._locale);
    }
    return this.TranslateEvent.Configs[key] ?? {}
  }

  getCurrentTranslation() {
    const key = document.body.getAttribute('language')

    return key ? this.TranslateEvent.Configs[key] ?? {} : {}
  }

}
