import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { UrlUsageGuideComponent } from './url-usage-guide.component';

@Injectable({
  providedIn: 'root'
})
export class UrlUsageGuideService {

  public opened=false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('url_usage_guide', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('url_usage_guide', {
      region: ['item'],
    });
  }
  open(config:MatDialogConfig) {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(UrlUsageGuideComponent, {
        panelClass: "_controller_settings",
        ...config
      });
      document.body.setAttribute("locked_region", "url_usage_guide")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "url_usage_guide" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  close() {
    this._dialog.closeAll();
  }
}
