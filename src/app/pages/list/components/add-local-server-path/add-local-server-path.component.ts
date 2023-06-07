import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadService } from '../../services/upload.service';
import { LoadingService } from '../loading/loading.service';
import { ConfigListService } from '../../services/config.service';

@Component({
  selector: 'app-add-local-server-path',
  templateUrl: './add-local-server-path.component.html',
  styleUrls: ['./add-local-server-path.component.scss'],
})
export class AddLocalServerPathComponent {
  public name = '';
  public oldName: string;
  api = 'http://localhost:9880';
  constructor(public uplaod: UploadService,public config:ConfigListService, public http: HttpClient,public _snackBar: MatSnackBar,public loading:LoadingService,) {
    this.oldName = this.name;
  }
  ngDoCheck() {
    if (this.name !== this.oldName) {
      this.add(btoa(encodeURI(this.name)));
      this.oldName = this.name;
    }
  }

  async add(path) {
    const files = (await firstValueFrom(
      this.http.get(`${this.api}/files/${path}`)
    )) as Array<{ id: string; path: string }>;
    if (files.length == 0) {
       this._snackBar.open("未找到数据","",{
        duration:100,
      });
      return
    }
    this.loading.open();
    // const index=this.config.list_menu_config.server.findIndex(x=>x.src==this.api);
    // if(!this.config.list_menu_config.server[index].subscriptions) this.config.list_menu_config.server[index].subscriptions=[];
    // const name=path;
    // this.config.list_menu_config.server[index].subscriptions.push({name,path})
    await this.uplaod.subscribe_to_file_directory(files,this.api,path)
    this.loading.close();
    return
  }
}
