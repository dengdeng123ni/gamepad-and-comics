import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor(private translate: TranslateService) {


    // function getAllNameValues(obj) {
    //   let values = [];
    //   for (const key in obj) {
    //     if (obj.hasOwnProperty(key)) {
    //       if (key === 'name'||key === 'label') {
    //         values.push(obj[key]); // 如果属性名是 'name'，将值添加到结果中
    //       }
    //       if (typeof obj[key] === 'object' && obj[key] !== null) {
    //         values = values.concat(getAllNameValues(obj[key])); // 递归处理嵌套对象
    //       }
    //     }
    //   }
    //   return values;
    // }






  }

  async getTranslatedText(name) {
    return await firstValueFrom(this.translate.get(name))
  }


  // languages = [ "ru", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"];
  // aaa=[]

  // download(filename, text) {
  //   var element = document.createElement('a');
  //   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  //   element.setAttribute('download', filename);

  //   element.style.display = 'none';
  //   document.body.appendChild(element);

  //   element.click();

  //   document.body.removeChild(element);
  // }

  // const name= this.translate.instant('unnamed_collection');
}


