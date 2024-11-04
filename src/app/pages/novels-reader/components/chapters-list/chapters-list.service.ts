import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { ChaptersListComponent } from './chapters-list.component';

@Injectable({
  providedIn: 'root'
})
export class ChaptersListService {

  constructor( public _dialog: MatDialog, public GamepadEvent: GamepadEventService) {
    GamepadEvent.registerAreaEvent('novels_chapter_item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('novels_chapters_list', {
      region: ['novels_chapter_item'],
    });
  }
  public opened: boolean = false;
  open(config?:MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ChaptersListComponent,{
        ...config,
        autoFocus:false
      });
      document.body.setAttribute("locked_region","novels_chapters_list");

      dialogRef.afterClosed().subscribe(() => {
        if(document.body.getAttribute("locked_region")=="novels_chapters_list"&&this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
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
