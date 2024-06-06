import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExportSettingsComponent } from './export-settings.component';

@Injectable({
  providedIn: 'root'
})
export class ExportSettingsService {

  opened = false;

  constructor(public _dialog: MatDialog
  ) {

  }
  open(config?: MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(ExportSettingsComponent, config);
      console.log(dialogRef);

      document.body.setAttribute("locked_region", "export_settings")

      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "export_settings" && this.opened) document.body.setAttribute("locked_region", "detail")
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
