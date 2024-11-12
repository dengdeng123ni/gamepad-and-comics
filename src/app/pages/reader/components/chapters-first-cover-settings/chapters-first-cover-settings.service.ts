import { Injectable } from '@angular/core';
import { ChaptersFirstCoverSettingsComponent } from './chapters-first-cover-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class ChaptersFirstCoverSettingsService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('chapters_item',{
      B:()=>setTimeout(()=>this.close())
    })
    GamepadEvent.registerConfig('chapters_list', {
      region: ['chapters_item'],
    });
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ChaptersFirstCoverSettingsComponent, {
        panelClass: "_chapters_list"
      });
      document.body.setAttribute("locked_region", "chapters_list")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "chapters_list" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }


}
