import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GamepadEventService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';
import { GamepadLeftCircleToolbarService } from '../gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.service';

const STORAGE_KEY = 'reader_left';
@Injectable({
  providedIn: 'root'
})
export class SidebarLeftService {
  local = {
    opened: false,
    isThumbtack: false
  };
  constructor(
    public GamepadEvent: GamepadEventService,
    public GamepadLeftCircleToolbar:GamepadLeftCircleToolbarService
  ) {
    this.GamepadEvent.registerAreaEvent("thumbnail_sidebar_left", {
      "B": () => this.close(),
      "LEFT_ANALOG_PRESS":()=>{
        this.close()
        this.GamepadLeftCircleToolbar.isToggle();
      },
    })

    this.GamepadEvent.registerConfig("thumbnail_sidebar_left", { region: ["thumbnail_sidebar_left"] })
  }

  opened=false;
  public afterClosed$ = new Subject();

  afterClosed() {
    return this.afterClosed$
  }
  open() {
    this.opened = true;
    this.afterClosed$.next(true);
    document.body.setAttribute("locked_region", "thumbnail_sidebar_left")
  }
  close() {
    if(document.body.getAttribute("locked_region")=="thumbnail_sidebar_left"&&this.opened) document.body.setAttribute("locked_region","reader")
    this.opened = false;
  }
  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }
}
