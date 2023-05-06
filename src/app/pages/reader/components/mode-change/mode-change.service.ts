import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';
import { ModeChangeComponent } from './mode-change.component';

declare const document: any;
@Injectable({
  providedIn: 'root'
})
export class ModeChangeService {

  constructor(
    public _dialog: MatDialog,
    public current: CurrentReaderService,
    public GamepadEvent: GamepadEventService,
    ) {
      this.GamepadEvent.registerAreaEvent("mode", {
        "B": () => this.close(),
      })
      GamepadEvent.registerConfig("mode", { region: ["mode"] })
  }
  opened: boolean = false;
  change(mode: number) {
    this.current.mode$.next(mode)
    this.close();
  }

  open(position?,panelClass?) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ModeChangeComponent,{
        position:position,
        delayFocusTrap:false,
        panelClass: panelClass
      });
      document.body.setAttribute("locked_region","mode")
      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="mode"&&this.opened) document.body.setAttribute("locked_region","all")
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
