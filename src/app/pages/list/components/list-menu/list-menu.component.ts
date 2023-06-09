import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { AddServerService } from '../add-server/add-server.service';
import { AddLocalServerPathService } from '../add-local-server-path/add-local-server-path.service';
import { CurrentListService } from '../../services/current.service';
import { UploadService } from '../../services/upload.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
    public http:HttpClient
  ) {


  }
  on(e, id) {
    this.current.change(id);
  }

  async on_local_server(e,api, id) {
    this.current.change(id);
    // const files = (await firstValueFrom(
    //   this.http.get(`${api}/files/${id}`)
    // ))
    // console.log(files,api,id);

    // this.upload.subscribe_to_file_directory(files,api,id);
  }
}
