import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DbComicsEventService, GamepadEventService } from 'src/app/library/public-api';
import { UrlToComicsIdComponent } from './url-to-comics-id.component';

@Injectable({
  providedIn: 'root'
})
export class UrlToComicsIdService {

  opened = false;
  list = [];
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent: GamepadEventService,
    public DbComicsEvent: DbComicsEventService,
  ) {
    GamepadEvent.registerAreaEvent('item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('url_to_comics_id', {
      region: ['item'],
    });
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(UrlToComicsIdComponent, {
        panelClass: "_url_to_comics_id"
      });
      document.body.setAttribute("locked_region", "url_to_comics_id")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "url_to_comics_id" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }

  async UrlToDetailIdAll(url) {
    this.list = []
    for (let index = 0; index < Object.keys(this.DbComicsEvent.Events).length; index++) {
      const x = Object.keys(this.DbComicsEvent.Events)[index];
      if (this.DbComicsEvent.Events[x]["UrlToDetailId"]) {
        await this.UrlToDetailId(x, url)
      }
    }
    if (this.list.length) {
      this.open();
    }
  }

  async UrlToComicsId(url):Promise<any> {
    for (let index = 0; index < Object.keys(this.DbComicsEvent.Events).length; index++) {
      const x = Object.keys(this.DbComicsEvent.Events)[index];
      if (this.DbComicsEvent.Events[x]["UrlToDetailId"]) {
        const id = await this.DbComicsEvent.Events[x]["UrlToDetailId"](url);
        if (id) {
          const detail = await this.DbComicsEvent.Events[x]["getDetail"](id);
          if (detail) {
            return {oright:x,title:detail.title,id:id}
          }
        }
      }
    }
    return null
  }



  async UrlToDetailId(x, url) {
    const id = await this.DbComicsEvent.Events[x]["UrlToDetailId"](url);
    if (id) {
      const detail = await this.DbComicsEvent.Events[x]["getDetail"](id);
      if (detail) {
        this.list.push({
          id: x,
          name: this.DbComicsEvent.Configs[x].name,
          detail: detail
        })
      }
    }
  }





}
