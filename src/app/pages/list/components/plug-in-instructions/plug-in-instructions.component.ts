import { Component } from '@angular/core';

@Component({
  selector: 'app-plug-in-instructions',
  templateUrl: './plug-in-instructions.component.html',
  styleUrl: './plug-in-instructions.component.scss'
})
export class PlugInInstructionsComponent {
  list = [
    "点击下载插件",
    "解压压缩包",
    "打开浏览器(Edge 为例子)",
    "点击浏览器的设置",
    "打开扩展/插件",
    "打开找到开发者模式打开",
    "点击加载解压缩的扩展",
    "打开我们解压后的插件文件夹",
    "点击确认",
    "成功插件列表会显示 手柄与漫画插件",
  ]
  constructor() {

  }

  on() {
    const c = document.querySelector("base").href + 'assets/zip/extended.zip';
    this.downloadFile(c, '手柄与漫画插件')
  }

  downloadFile(url, fileName) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
        link.click();
      });
  }

}
