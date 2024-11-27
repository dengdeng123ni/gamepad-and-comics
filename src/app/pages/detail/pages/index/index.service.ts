import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(public GamepadEvent: GamepadEventService) {


    GamepadEvent.registerConfig("detail", { region: ["continue", "back", "chapters_item","context_menu_edit_item","chapters_text"] })

    GamepadEvent.registerAreaEvent('continue', { B: () => this.back() })
    GamepadEvent.registerAreaEvent('back', { B: () => this.back() })

    GamepadEvent.registerAreaEvent('chapters_text', { B: () => this.back()})
    GamepadEvent.registerAreaEvent('chapters_item', { B: () => this.back()})
  }
  back() {
    window.history.back()
  }
}
