import { Component } from '@angular/core';
import { ContextMenuControllerService, GamepadControllerService, GamepadEventService } from './library/public-api';
import { compressAccurately } from 'image-conversion';
import { NavigationStart, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';

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
    public router: Router
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




  }
  ngAfterViewInit() {
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
    const button = document.querySelector("button")
    button.addEventListener('pointerup', function (event) {
      (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true })
        .then(device => {
          console.log(device);

         })
        .catch(error => { console.error(error); });
    });
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

