import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { CachePageComponent } from './cache-page.component';

@Injectable({
  providedIn: 'root'
})
export class CachePageService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    // this.open({})
    GamepadEvent.registerAreaEvent('menu_search', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('menu_search', {
      region: ['menu_search_input','menu_search_comics_item'],
    });
  }
  open(config:MatDialogConfig) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(CachePageComponent, {
        panelClass: "_controller_settings",
        ...config
      });
      document.body.setAttribute("locked_region", "menu_search")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "menu_search" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  close() {
    this._dialog.closeAll();
  }
}
