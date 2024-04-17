import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnePageThumbnailMode2Service {
  constructor(
  ) {
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
