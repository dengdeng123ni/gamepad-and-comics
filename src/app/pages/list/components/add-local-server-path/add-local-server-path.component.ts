import { Component } from '@angular/core';
import { firstValueFrom, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadService } from '../../services/upload.service';
import { LoadingService } from '../loading/loading.service';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { AddLocalServerPathService } from './add-local-server-path.service';

@Component({
  selector: 'app-add-local-server-path',
  templateUrl: './add-local-server-path.component.html',
  styleUrls: ['./add-local-server-path.component.scss'],
})
export class AddLocalServerPathComponent {
  public name = '';
  public oldName: string;
  is_destroy = false;
  api = 'http://localhost:9880';
  constructor(public uplaod: UploadService,
    public current:CurrentListService,
    public addLocalServerPath:AddLocalServerPathService,
     public config: ConfigListService, public http: HttpClient, public _snackBar: MatSnackBar, public loading: LoadingService,) {
    this.oldName = this.name;

    this.init();
  }
  ngDoCheck() {
    if (this.name !== this.oldName) {
      this.add(this.name);
      this.oldName = this.name;
    }
    this.is_destroy = true;
  }
  async init() {
    const getClipboard = () => {
      setTimeout(async () => {
        const text = await navigator.clipboard.readText();
        console.log(text);

        if (this.isPath(text)) this.name = text;
        else {
          if (!this.is_destroy) getClipboard();
        }
      }, 300)
    }
    getClipboard();
  }

  isPath(str) {
    var isPath = str.split("/")
    return isPath.length > 1
  }
  async add(path) {
    this.loading.open();
    const id = btoa(encodeURI(path));
    const name = path.split("/").at("-1");
    const files = (await firstValueFrom(
      this.http.get(`${this.api}/files/${id}`)
    )) as Array<{ id: string; path: string }>;
    if (files.length == 0) {
      this._snackBar.open("未找到数据", "", {
        duration: 100,
      });
      this.loading.close();
      return
    }
    // /Users/zhiangzeng/iCloud云盘（归档）/Documents/多层漫画2

    const index = this.config.list_menu_config.server.findIndex(x => x.src == this.api);
    if (index <= -1) {
      this.loading.close();
      return
    }
    if (this.config.list_menu_config.server[index].subscriptions.find(x => x.id == id)) {

    } else {
      this.config.list_menu_config.server[index].subscriptions.push({ name, id })
    }
    this.config.save_list_menu_config();
    await this.uplaod.subscribe_to_file_directory(files, this.api, id)
    this.loading.close();
    this.addLocalServerPath.close();
    this.current.getComicsInfoAll();
    return
  }
}
