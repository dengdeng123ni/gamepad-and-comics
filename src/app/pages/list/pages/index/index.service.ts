import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { EventService } from 'src/app/library/public-api';
import { MenuService } from '../../components/menu/menu.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(
    public GamepadEvent:GamepadEventService,
    public Event:EventService,
    public menu:MenuService
    ) {


    GamepadEvent.registerConfig("list", { region: ["comics_item","comics_option"] })
    GamepadEvent.registerConfig("comics_type", { region: ["comics_type_item"] })

    GamepadEvent.registerAreaEvent("menu",{
      B:()=>menu.close()
    })
    Event.register('menu', {
      name: "菜单",
      icon: "menu",
      router:"list",
      event: () => this.menu.isToggle(),
      shortcut_key:{
        gamepad:{
          position:"center",
          index:1
        }
      }
    })
  }
}
