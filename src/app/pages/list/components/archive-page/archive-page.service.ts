import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ArchivePageComponent } from './archive-page.component';

@Injectable({
  providedIn: 'root'
})
export class ArchivePageService {


  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('archive_page_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('archive_page', {
      region: ['archive_page_item'],
    });
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(ArchivePageComponent, {
        panelClass: "_archive_page"
      });
      document.body.setAttribute("locked_region", "archive_page")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "archive_page" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
