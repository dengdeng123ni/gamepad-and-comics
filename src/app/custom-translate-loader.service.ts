import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  // 通过 URL 或其他动态参数来获取翻译文件
  getTranslation(lang: string): Observable<any> {
    // 你可以根据条件动态构建文件路径
    const filePath = `./assets/i18n/${lang}.json`;
    return this.http.get(filePath);
  }
}
