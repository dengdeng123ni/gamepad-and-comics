import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { ComicsSelectTypeComponent } from './comics-select-type.component';
@Injectable({
  providedIn: 'root'
})
export class ComicsSelectTypeService {

  opened = false;

  is_close = false;
  list: Array<{
    id: string | number,
    name: string
  }> = [];
  index = null;
  constructor(
    public _dialog: MatDialog,
  ) {
  }

  async getType(list: Array<{
    id: string | number,
    name: string
  }>, index: string | number, option: {
    position: DialogPosition
  }): Promise<string | number> {
    this.list = list;
    this.index = index;
    if (this.opened == false) {

      this.opened = true;
      const dialogRef = this._dialog.open(ComicsSelectTypeComponent, {
        position: option.position,
        delayFocusTrap: false,
        panelClass: "_comics_select_type",
        backdropClass: "_comics_select_type_bg",
      });
      document.body.setAttribute("locked_region", "comics_type")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "comics_type" && this.opened) document.body.setAttribute("locked_region", "list")
        this.opened = false;
      });
    }

    return new Promise((r, j) => {
      const _f = () => {
        setTimeout(() => {
          if (!this.opened) {
            r(this.index)
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
