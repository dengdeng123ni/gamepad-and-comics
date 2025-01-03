import { Injectable } from '@angular/core';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { UnlockComponent } from '../components/unlock/unlock.component';
import { DbComicsControllerService, DbComicsEventService, GamepadEventService, NotifyService } from 'src/app/library/public-api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UnlockService {

  opened = false;

  is_lock = false;

  _data = {

  }
  chapter_id=null;
  constructor(
    public _dialog: MatDialog,
    public DbComicsController: DbComicsControllerService,
    public DbComicsEvent: DbComicsEventService,
    private _snackBar: MatSnackBar,
    public Notify:NotifyService,
    public GamepadEvent: GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('chapter_unlock', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('chapter_unlock', {
      region: ['item'],
    });
  }
  async open(source, chapter_id) {
    this.chapter_id=chapter_id;
    if(this._data[chapter_id]) return
    else this._data[chapter_id]= chapter_id;
    if (this.DbComicsEvent.Events[source]?.Unlock) {
      this.openUnlock();
    } else {
      this.Notify.messageBox('当前章节未解锁,需要到对应网站解锁', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
    }
  }
  async openUnlock(){
    if (this.opened == false) {
      this.opened = true;
      const dialogRef = this._dialog.open(UnlockComponent, {
        delayFocusTrap: false,
        panelClass: "_chapter_unlock",
      });
      document.body.setAttribute("locked_region", "chapter_unlock")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "chapter_unlock" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }

  }

  close() {
    this._dialog.closeAll();
  }

}
