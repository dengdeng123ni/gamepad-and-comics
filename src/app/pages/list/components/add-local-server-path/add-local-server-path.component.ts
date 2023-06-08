import { Component } from '@angular/core';
import { firstValueFrom, retry } from 'rxjs';
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
      this.add(this.name);
      this.oldName = this.name;
    }
  }

  async add(path) {
    const id=btoa(encodeURI(path));
    const name=path.split("/").at("-1");
    const files = (await firstValueFrom(
      this.http.get(`${this.api}/files/${id}`)
    )) as Array<{ id: string; path: string }>;
    if (files.length == 0) {
       this._snackBar.open("未找到数据","",{
        duration:100,
      });
      return
    }
    // /Users/zhiangzeng/iCloud云盘（归档）/Documents/多层漫画2
    this.loading.open();
    const index=this.config.list_menu_config.server.findIndex(x=>x.src==this.api);
    console.log(index);

    if(index<=-1) {
      this.loading.close();
      return
    }
    if(this.config.list_menu_config.server[index].subscriptions.find(x=>x.id==id)){

    }else{
      this.config.list_menu_config.server[index].subscriptions.push({name,id})
    }
    this.config.save_list_menu_config();
    await this.uplaod.subscribe_to_file_directory(files,this.api,id)
    this.loading.close();
    return
  }
}
