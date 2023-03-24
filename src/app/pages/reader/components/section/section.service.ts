
import { Inject, Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { GamepadEventService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';
import { SectionComponent } from './section.component';

declare const document: any;
@Injectable({
  providedIn: 'root'
})
export class SectionService {
  opened: boolean = false;
  list = [];
  constructor(
    public _sheet: MatBottomSheet,
    private db: NgxIndexedDBService,
    public GamepadEvent: GamepadEventService,
    public current: CurrentReaderService,
  ) {
    GamepadEvent.registerAreaEvent("section", {
      "B": () => this.close(),
    })

    GamepadEvent.registerAreaEvent("section_tab", {
      "B": () => this.close(),
    })
  }
  open() {
    if (this.opened == false) {
      // const images = this.current.images.list;
      // this.list=Object.keys(images).map(x=>({id:x,total:images[x].length,image:images[x][0].image}))
      if (this.opened == false) {
        const sheetRef = this._sheet.open(SectionComponent,{
          panelClass:"section"
        });
        document.body.setAttribute("locked_region", "[region=section]")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "[region=section]" && this.opened) document.body.setAttribute("locked_region", "all")
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

  onChnage(id,pid?) {
    // if(pid) this.current.onChange(id,pid);
    // else this.current.onChange(id);
    // this.close();
  }

}
