import { Injectable, NgZone } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GamepadEventService, IndexdbControllerService } from 'src/app/library/public-api';
import { ComicsListConfigComponent } from './comics-list-config.component';


import { DataService } from '../../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ComicsListConfigService {
  key = "_gh_comics_list_config";
  opened: boolean = false;
  constructor(
    public _sheet: MatBottomSheet,
    public GamepadEvent: GamepadEventService,
    public data: DataService,
    public webDb: IndexdbControllerService,
    private zone: NgZone,
  ) {
    GamepadEvent.registerAreaEvent('chapters_item', {
      B: () => setTimeout(() => this.close())
    })
    this.init();
  }
  init(){
    this.get();
  }
  open() {
    if (this.opened == false) {
      // const images = this.current.images.list;
      // this.list=Object.keys(images).map(x=>({id:x,total:images[x].length,image:images[x][0].image}))
      if (this.opened == false) {
        const sheetRef = this._sheet.open(ComicsListConfigComponent, {
          panelClass: "_chapters_thumbnail"
        });
        document.body.setAttribute("locked_region", "chapters_thumbnail")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "chapters_thumbnail" && this.opened) document.body.setAttribute("locked_region", document.body.getAttribute("router"))
          this.opened = false;
          this.post();
        });

      }
      this.opened = true;
    }
  }

  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }

  close = () => {

    this._sheet.dismiss();
  }

  async post() {
    return await this.webDb.update("data", {
      id: this.key,
      click_type: this.data.config.click_type
    })
  }

  async get() {
    const res: any = await this.webDb.getByKey("data", this.key)

    if (res) {
      this.data.config.click_type = res.click_type;
    }
  }
}

