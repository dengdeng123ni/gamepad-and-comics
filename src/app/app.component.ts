import { Component } from '@angular/core';
import { ContextMenuControllerService, GamepadControllerService, GamepadEventService } from './library/public-api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public GamepadController: GamepadControllerService,
    public GamepadEvent:GamepadEventService,
    public ContextMenuController:ContextMenuControllerService
  ) {
    this.GamepadEvent.registerAreaEvent("content_menu_submenu", {
      "B": () => {
        this.ContextMenuController.close();
      }
    })

    this.GamepadEvent.registerAreaEvent("content_menu", {
      "B": () => {
        this.ContextMenuController.close();
      }
    })
  //  this.separateImage("http://localhost:7899/image/1679852350131")

  }
  async separateImage(src) {
    const image1: any = await this.createImage(src);
    let canvas1 =  document.createElement('canvas');
    canvas1.width = 1250;
    canvas1.height = 1765;
    let context1 = canvas1.getContext('2d');
    const height=2500*(image1.height/image1.width)
    context1.rect(0, 0, canvas1.width, canvas1.height);
    context1.drawImage(image1, 0,(1765-height)/2, 2500,height);
    let canvas2 = document.createElement('canvas');
    canvas2.width = 1250;
    canvas2.height = 1765;
    let context2 = canvas2.getContext('2d');
    context2.rect(0, 0, canvas2.width, canvas2.height);
    context2.drawImage(image1, 0,(1765-height)/2, 2500,height,1250,0,2500,height);
    let dataURL1 = canvas1.toDataURL("image/png",0.5);
    let dataURL2 = canvas2.toDataURL("image/jpeg",0.5);

    const blob1 = this.base64ToBlob(dataURL1, "png")
    const blob2 = this.base64ToBlob(dataURL2, "jpeg")
    console.log(URL.createObjectURL(blob1));

   console.log( URL.createObjectURL(blob2));

    // return [blob1, blob2]
  }
  createImage = (src) => {
    return new Promise((r, j) => {
      if (!src) {
        j({
          width: 0,
          height: 0
        })
      }
      var img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.src = src;
      img.onload = function () {
        r(img)
        j(img)
      };
    })
  }
  base64ToBlob(urlData, type) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || type;
    // 去掉url的头，并转化为byte
    let bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mime
    });
  }
}

