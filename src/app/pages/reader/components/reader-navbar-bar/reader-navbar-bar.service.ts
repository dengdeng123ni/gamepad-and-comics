import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CurrentService } from '../../services/current.service';

@Injectable({
  providedIn: 'root'
})
export class ReaderNavbarBarService {
  opened = false;
  constructor(
    public current: CurrentService,
  ) {

    this.current.readerNavbarBar$.subscribe(x => {
      if (x == true) {

        this.open();

      } else {

        this.close();
      }
    })
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
      if (document.body.getAttribute("locked_region") == "reader_navbar_bar") document.body.setAttribute("locked_region",document.body.getAttribute("router"))

    }
  }



}
