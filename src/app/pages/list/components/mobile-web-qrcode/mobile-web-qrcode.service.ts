import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MobileWebQrcodeComponent } from './mobile-web-qrcode.component';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class MobileWebQrcodeService {
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('mobile_web_qrcode_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('mobile_web_qrcode', {
      region: ['mobile_web_qrcode_item'],
    });
  }
  public opened: boolean = false;
  open(config?: MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(MobileWebQrcodeComponent, config);
      document.body.setAttribute("locked_region", "mobile_web_qrcode")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "mobile_web_qrcode" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
      this.opened = true;
    }
  }

  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }
  close() {
    this._dialog.closeAll();
  }
}
