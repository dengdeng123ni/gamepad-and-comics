import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamepadEventService } from 'src/app/library/public-api';
import { LanguageSettingsComponent } from './language-settings.component';

@Injectable({
  providedIn: 'root'
})
export class LanguageSettingsService {

  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
  ) {
    this.GamepadEvent.registerConfig("language_settings", { region: ["language_setting"] })
    this.GamepadEvent.registerAreaEvent("language_setting", {
      "B": () => this.close(),
    })
  }
  opened = false;
  open() {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(LanguageSettingsComponent, {
        panelClass: "settings",
        autoFocus: false
      });
      document.body.setAttribute("locked_region", `language_settings`)
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "language_settings" && this.opened) document.body.setAttribute("locked_region", "list")
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
