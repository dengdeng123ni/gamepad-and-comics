import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { I18nService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private _snackBar: MatSnackBar,public I18n:I18nService) { }


  async messageBox(message: string, action?: string, config?: MatSnackBarConfig) {
    let action1=''
    let message1=await this.I18n.getTranslatedText(message)
    if(action) action1= await this.I18n.getTranslatedText(action)

    message1 = await this.asyncReplace(message1);
    action1 = await this.asyncReplace(action1);
    this._snackBar.open(message1, action1, config)
  }
  async asyncReplace(template) {
    const matches = [...template.matchAll(/\$\[([^\]]+)]/g)]; // 提取所有占位符匹配

    const replacements = await Promise.all(
      matches.map(async ([match, key]) => {
        const res = await this.I18n.getTranslatedText(key); // 调用异步获取翻译
        return { match, replacement: res !== undefined ? res : match }; // 保存匹配结果
      })
    );

    // 替换模板中的占位符
    for (const { match, replacement } of replacements) {
      template = template.replace(match, replacement);
    }

    return template;
  }
}


// async function asyncReplace(template, getTranslatedText) {
//   const matches = [...template.matchAll(/\$\[(\w+)]/g)]; // 提取所有占位符匹配

//   const replacements = await Promise.all(
//     matches.map(async ([match, key]) => {
//       const res = await getTranslatedText(key); // 调用异步获取翻译
//       return { match, replacement: res !== undefined ? res : match }; // 保存匹配结果
//     })
//   );

//   // 替换模板中的占位符
//   for (const { match, replacement } of replacements) {
//     template = template.replace(match, replacement);
//   }

//   return template;
// }

// // 示例使用
// await(async () => {
//   const message = "Hello $[username], your order ID is $[orderId].";

//   const getTranslatedText = async (key) => {
//     // 模拟异步翻译逻辑
//     const translations = {
//       username: "Alice",
//       orderId: "12345"
//     };
//     return translations[key];
//   };

//   const result = await asyncReplace(message, getTranslatedText);
//   console.log(result);
//   // 输出: "Hello Alice, your order ID is 12345."
// })();
