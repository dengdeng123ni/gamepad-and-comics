import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResetReadingProgressComponent } from './reset-reading-progress.component';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class ResetReadingProgressService {
  opened=false;
  constructor(public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
    ) {
    this.GamepadEvent.registerAreaEvent("reset_reading_progress", {
      "B": () => this.close(),
    })
    GamepadEvent.registerConfig("reset_reading_progress", { region: ["reset_reading_progress"] })
  }

  open() {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ResetReadingProgressComponent, {
        width: '250px'
      });
      document.body.setAttribute("locked_region","reset_reading_progress")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="reset_reading_progress"&&this.opened) document.body.setAttribute("locked_region","detail")
        this.opened = false;
      });
      this.opened=true;
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
