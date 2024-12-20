import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { TranslateControllerService } from './translate-controller.service';

@Injectable({
  providedIn: 'root',
})
export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    public TranslateController: TranslateControllerService

  ) { }

  // 通过 URL 或其他动态参数来获取翻译文件
  getTranslation(lang: string): Observable<any> {
    const filePath = `./assets/i18n/${lang}.json`;
    const additionalData = of(this.TranslateController.getTranslation(lang));

    return forkJoin({
      translation: this.http.get(filePath),
      additional: additionalData
    }).pipe(
      map(result => ({ ...result.translation, ...result.additional }))
    );
  }
}
