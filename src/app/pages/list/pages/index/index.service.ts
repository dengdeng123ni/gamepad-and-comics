import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { AppDataService, ContextMenuEventService } from 'src/app/library/public-api';
import { MenuService } from '../../components/menu/menu.service';
import { DownloadOptionService } from '../../components/download-option/download-option.service';
import { LocalCachService } from '../../components/menu/local-cach.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(
    public GamepadEvent:GamepadEventService,
    public ContextMenuEvent: ContextMenuEventService,
    public menu:MenuService,
    public AppData:AppDataService,
    public DownloadOption: DownloadOptionService,
    public LocalCach: LocalCachService,
    ) {


    GamepadEvent.registerConfig("list", { region: ["comics_item","comics_option","menu_item"] })
    GamepadEvent.registerConfig("comics_type", { region: ["comics_type_item"] })

    GamepadEvent.registerAreaEvent("menu",{
      B:()=>menu.close()
    })

    AppData.origin$.subscribe((x:any)=>{
      this.updateComicsItem(x)
    })
    // this.updateComicsItem(AppData.originConfig)


  }

  updateComicsItem(x){
    if(x.is_download){
      this.ContextMenuEvent.registerMenu('comics_item', [
        {
          name: "下载", id: "download", click: async (list) => {
            this.DownloadOption.open(list)
          }
        },
        {
          name: "缓存", id: "local_cach", click: async (list) => {
             for (let index = 0; index < list.length; index++) {
              await this.LocalCach.save(list[index].id);
             }
          }
        },
      ])
      if(x.id=="local_cache")  {
        this.ContextMenuEvent.logoutMenu('comics_item', 'local_cach')
      }
    }else{
      this.ContextMenuEvent.logoutMenu('comics_item', 'download')
      this.ContextMenuEvent.logoutMenu('comics_item', 'local_cach')
    }
  }
}
