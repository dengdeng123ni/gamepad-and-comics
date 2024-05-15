import { Injectable } from '@angular/core';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { UnlockComponent } from './unlock.component';

@Injectable({
  providedIn: 'root'
})
export class UnlockService {

  opened = false;

  is_lock = false;

  constructor(
    public _dialog: MatDialog,
  ) {
  }

  async openUnlock(): Promise<boolean> {
    if (this.opened == false) {
      this.is_lock = true;
      this.opened = true;
      const dialogRef = this._dialog.open(UnlockComponent, {
        delayFocusTrap: false,
        panelClass: "_chapter_unlock",
        backdropClass: "_chapter_unlock_bg",
      });
      document.body.setAttribute("locked_region", "chapter_unlock")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "chapter_unlock" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }

    return new Promise((r, j) => {
      const _f = () => {
        setTimeout(() => {
          if (!this.opened) {
            r(this.is_lock)
            this.close();
          } else {
            _f();
          }
        }, 33)
      }
      _f();
    })
  }

  close() {
    this._dialog.closeAll();
  }

}
