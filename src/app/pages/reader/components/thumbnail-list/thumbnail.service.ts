import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GamepadEventService } from 'src/app/library/public-api';
import { ThumbnailListComponent } from './thumbnail-list.component';
@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  constructor(private _sheet: MatBottomSheet,
    public GamepadEvent: GamepadEventService,
  ) {
    this.GamepadEvent.registerAreaEvent("thumbnail_list", {
      "B": () => this.close(),
    })

    this.GamepadEvent.registerConfig("thumbnail_list", { region: ["thumbnail_list"] })
  }
  opened: boolean = false;
  scrollTop = 0;
  open() {
    if (this.opened == false) {
      if (this.opened == false) {
        const dialogRef = this._sheet.open(ThumbnailListComponent, { panelClass: "_thumbnail_list",  data: { index: 4 } });
        document.body.setAttribute("locked_region", "thumbnail_list")
        dialogRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "thumbnail_list" && this.opened) document.body.setAttribute("locked_region", "reader")
          this.opened = false;
        });
      }
      this.opened = true;
    }
  }

  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }

  close() {
    this._sheet.dismiss();

  }

}
