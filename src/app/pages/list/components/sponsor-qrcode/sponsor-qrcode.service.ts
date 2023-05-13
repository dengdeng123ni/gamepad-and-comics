import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { SponsorQrcodeComponent } from './sponsor-qrcode.component';

@Injectable({
  providedIn: 'root'
})
export class SponsorQrcodeService {

  constructor(public _dialog:MatDialog,
    public GamepadEvent:GamepadEventService

    ) {
    this.GamepadEvent.registerAreaEvent("sponsor_qrcode", {
      "B": () => this.close(),
    })
    GamepadEvent.registerConfig("locked_region",{region:["sponsor_qrcode"]})
   }
  opened=false;
  data="wxp://f2f1B25tKxqxiRjKelqY9Plbkowp6kSoHH1J-zSqEqg-CWRh4g_U1iACBtB_xN67TGrL";
  open() {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(SponsorQrcodeComponent, {
        panelClass: "_sponsor_qrcode",
        backdropClass:"_sponsor_qrcode_backdrop"
      });
      document.body.setAttribute("locked_region", `sponsor_qrcode`)
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region")=="sponsor_qrcode" && this.opened) document.body.setAttribute("locked_region", "list")
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
