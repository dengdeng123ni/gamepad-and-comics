import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { AddServerService } from '../add-server/add-server.service';
import { AddLocalServerPathService } from '../add-local-server-path/add-local-server-path.service';
import { CurrentListService } from '../../services/current.service';
import { UploadService } from '../../services/upload.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent {
  constructor(
    public i18n: I18nService,
    public AddServer: AddServerService,
    public config: ConfigListService,
    public current: CurrentListService,
    public upload:UploadService,
    public AddLocalServerPath: AddLocalServerPathService,
    public loading:LoadingService,
    public http:HttpClient
  ) {


  }
  on(e, id) {
    this.current.change(id);
  }

  async on_local_server(e,api, id) {
    this.current.change(id);
    setTimeout(async ()=>{
      const files = (await firstValueFrom(
        this.http.get(`${api}/files/${id}`)
      ))
      const size=new Blob([JSON.stringify(files)]).size;
      // console.log(files,api,id);
      const index = this.config.list_menu_config.server.findIndex(x => x.src == api);
      if (index <= -1) {
        return
      }
      if (this.config.list_menu_config.server[index].subscriptions.find(x => x.id == id)) {
        if(this.config.list_menu_config.server[index].subscriptions.find(x => x.id == id).size==size) {

          return
        }else{
          this.loading.open();
          await this.upload.subscribe_to_file_directory(files,api,id);
          this.loading.close();
        }
      }
    },2000)
  }
}
