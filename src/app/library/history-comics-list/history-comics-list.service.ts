import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { HistoryComicsListComponent } from './history-comics-list.component';

@Injectable({
  providedIn: 'root'
})
export class HistoryComicsListService {

  constructor( public _dialog: MatDialog, public GamepadEvent: GamepadEventService) {
    GamepadEvent.registerAreaEvent('history_comics_list', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('history_comics_list', {
      region: ['item'],
    });
  }
  public opened: boolean = false;
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(HistoryComicsListComponent,{ panelClass: "_history_comics_list",});
      document.body.setAttribute("locked_region","history_comics_list");

      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="history_comics_list"&&this.opened) document.body.setAttribute("locked_region","reader")
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
