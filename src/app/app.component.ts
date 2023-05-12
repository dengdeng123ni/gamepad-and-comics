import { Component } from '@angular/core';
import { ContextMenuControllerService, GamepadControllerService, GamepadEventService } from './library/public-api';
import { compressAccurately } from 'image-conversion';
import { NavigationStart, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
declare const webkitSpeechRecognition: any;
declare const speechRecognition: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public GamepadController: GamepadControllerService,
    public GamepadEvent: GamepadEventService,
    public ContextMenuController: ContextMenuControllerService,
    public router:Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url.split("/")[1] == "") {
          document.body.setAttribute("router", "list")
        }
        if (event.url.split("/")[1] == "reader") {
          document.body.setAttribute("router", "reader")
        }
        if (event.url.split("/")[1] == "detail") {
          document.body.setAttribute("router", "detail")
        }
      }
    })
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
    GamepadEvent.registerConfig("content_menu", { region: ["content_menu", "content_menu_submenu"] })
    this.getPlatform();
    setInterval(() => {
      // var utterance = new SpeechSynthesisUtterance("Now!");
      // speechSynthesis.speak(utterance);
    }, 1000)
    const recognition$=new Subject();
    const recognition = new webkitSpeechRecognition();
    console.log(recognition);

    // 配置设置以使每次识别都返回连续结果
    recognition.continuous = true;
    recognition.lang = window.navigator.language || 'en-US';
    // 配置应返回临时结果的设置
    recognition.interimResults = true;
    // recognition.start();
    // 正确识别单词或短语时的事件处理程序1
    recognition.onresult = (event) => {
      recognition$.next(event)
    };
    recognition.onend = (event) => {

    };
    recognition$.subscribe(x=>{
      console.log(x);

    })
    // recognition$.pipe(debounceTime(100)).subscribe(x=>{
    //   console.log(x);

    // })


  }
  getPlatform() {
    const ua = navigator.userAgent.toLowerCase();
    const platform: any = {};
    const MAP_EXP = {
      Mac: /(mac os x)\s+([\w_]+)/,
      Windows: /(windows nt)\s+([\w.]+)/,
      Ios: /(i(?:pad|phone|pod))(?:.*)cpu(?: i(?:pad|phone|pod))? os (\d+(?:[\.|_]\d+){1,})/,
      Android: /(android)\s+([\d.]+)/,
      Ipad: /(ipad).*os\s([\d_]+)/,
      Iphone: /(iphone\sos)\s([\d_]+)/,
    };
    for (let key in MAP_EXP) {
      const uaMatch = ua.match(MAP_EXP[key]);
      if (!!uaMatch) {
        if (!document.body.getAttribute("operate")) {
          if ("Windows" == key) {
            document.body.setAttribute("system", "windows")
          }
        }

      }
    }
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

