import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class OnePageThumbnailMode2Service {
  constructor(
     public GamepadEvent: GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('one_page_thumbnail_mode2', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('thumbnail_sidebar_left', {
      region: ['one_page_thumbnail_mode2'],
    });
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
