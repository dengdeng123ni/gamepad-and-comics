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
  }
}

