import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';

@Injectable({
  providedIn: 'root'
})
export class ReaderNavbarBarService {
  opened = false;
  constructor(
    public current: CurrentReaderService,
    public GamepadEvent: GamepadEventService,
    public GamepadController:GamepadControllerService
  ) {

    this.current.readerNavbarBar$.subscribe(x => {
      if (x == true) {

        this.open();

      } else {

        this.close();
      }
    })

    this.GamepadEvent.registerConfig("reader_navbar_bar", { region: ["reader_navbar_bar_top_item","reader_navbar_bar_buttom_item"] })
  }
  change$ = new Subject();
  change() {
    return this.change$;
  }
  open() {
    if (this.opened == false) {
      this.opened = true;
      this.change$.next(true)
      document.body.setAttribute("locked_region", "reader_navbar_bar")
    }
  }

  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }

  close() {
    if (this.opened == true) {
      this.opened = false;
      this.change$.next(false)
      if (document.body.getAttribute("locked_region") == "reader_navbar_bar") document.body.setAttribute("locked_region", "all")

    }
  }



}
