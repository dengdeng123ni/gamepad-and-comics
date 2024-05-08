import { Component, HostListener, Query } from '@angular/core';
import { AppDataService, ContextMenuControllerService, DbControllerService, ImageService, MessageControllerService, MessageEventService, PulgService } from './library/public-api';
import { GamepadControllerService } from './library/gamepad/gamepad-controller.service';
import { GamepadLeftCircleToolbarService } from './library/event/gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.service';
import { GamepadEventService } from './library/gamepad/gamepad-event.service';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { WebFileService } from './library/web-file/web-file.service';

export const slideInAnimation =
  trigger('routeAnimation', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        })
      ]),
      query(':enter', [
        style({ top: '100vh' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('100ms ease-out', style({ top: '-100vh' }))
        ]),
        query(':enter', [
          animate('100ms ease-out', style({ top: '0vh' }))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  is_loading_page = false;
  is_data_source = true;
  keys = [];
  is_tab = false;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    let key = "";
    if(event.key=="Enter"){
      if(this.is_tab) return true
    }else{
      this.is_tab = false;
    }
    if (event.code == "Space") key = "Space";
    else key = event.key
    const obj = this.keys.find(x => x == key)
    if (obj) {
      return false
    } else {
      const bool = this.GamepadController.device2(key);
      if (bool) {
        if (event.key == "Tab") {
          this.is_tab = true;
          return true
        }else{

        }
        return bool
      } else {
        this.keys.push(key)
        return bool
      }

    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp = (event: KeyboardEvent) => {
    let key = "";
    if (event.code == "Space") key = "Space";
    else key = event.key
    this.keys = this.keys.filter(x => x != key)
    if (key == "Alt") this.GamepadController.Y = false;
  }


  constructor(
    public GamepadController: GamepadControllerService,
    public GamepadEvent: GamepadEventService,
    public MessageController: MessageControllerService,
    public GamepadLeftCircleToolbar: GamepadLeftCircleToolbarService,
    public MessageEvent: MessageEventService,
    public DbController: DbControllerService,
    public ContextMenuController: ContextMenuControllerService,
    private contexts: ChildrenOutletContexts,
    public ccc: WebFileService,
    public image: ImageService,
    public pulg: PulgService,
    public App: AppDataService
  ) {
    GamepadEvent.registerGlobalEvent({
      LEFT_ANALOG_PRESS: () => GamepadLeftCircleToolbar.isToggle()
    })
    MessageEvent.service_worker_register('local_image', async (event: any) => {
      const data = event.data;
      await DbController.getImage(data.id)
      return { id: data.id, type: "local_image" }
    })

    MessageEvent.service_worker_register('init', async (event: any) => {
      document.body.setAttribute("pwa", "true")
      this.App.is_pulg = true;
    })


    this.init();

  }

  async init() {
    await this.pulg.init();
    setTimeout(() => {
      if (navigator) navigator?.serviceWorker?.controller?.postMessage({ type: "_init" })
      this.getPulgLoadingFree();
      this.is_loading_page = true;
      setTimeout(() => {
        this.App.init();
      }, 50)
    }, 200)
    // this.getPulgLoadingFree();
  }
  getAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
  getPulgLoadingFree() {
    if (document.body.getAttribute("pulg")) {
      this.App.is_pulg = true;
    } else {
      setTimeout(() => {
        this.getPulgLoadingFree();
      }, 50)
    }
  }

}

// if (typeof Worker !== 'undefined') {
//   // Create a new
//   const worker = new Worker(new URL('./app.worker', import.meta.url));
//   worker.onmessage = ({ data }) => {
//     console.log(`page got message: ${data}`);
//   };
//   worker.postMessage('hello');

// } else {
//   // Web Workers are not supported in this environment.
//   // You should add a fallback so that your program still executes correctly.

// }
