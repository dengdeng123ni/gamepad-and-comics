import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ContextMenuControllerService, GamepadControllerService, GamepadEventService, MessageControllerService } from './library/public-api';
import { compressAccurately } from 'image-conversion';
import { NavigationStart, Router } from '@angular/router';
import { Subject, async, debounceTime } from 'rxjs';
import { AppWorkerService } from './worker/app-worker.service';

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
    public AppWorker: AppWorkerService,
    public MessageController:MessageControllerService,
    public router: Router,
    private renderer: Renderer2,
    private el: ElementRef
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

    const script = this.renderer.createElement('script');
    script.src = 'http://localhost:3200/assets/js/bilibili-chapter-list.js';
    script.onload = () => {
      // 在脚本加载完成后执行的代码
    };
    script.type="module"
    document.body.appendChild(script);
  }

  async ngAfterViewInit() {
    // var video = document.querySelector("video");
    // video.setAttribute('playsinline', '');
    // video.setAttribute('autoplay', '');
    // video.setAttribute('muted', '');
    // video.style.width = '200px';
    // video.style.height = '200px';
    // var constraints = {
    //   audio: false,
    //   video: {
    //     facingMode: "user"
    //   }
    // };
    // navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    //   video.srcObject = stream;
    // });
    //     const pointerup=async (event)=>{
    //       const device =await (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true })
    //       console.log(device);

    //       const server= await device.gatt.connect()
    // console.log(server);


    //     }
    //     const button = document.querySelector("button")
    //     button.addEventListener('pointerup',pointerup );
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
}

