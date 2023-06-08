import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddServerService } from './add-server.service';

@Component({
  selector: 'app-add-server',
  templateUrl: './add-server.component.html',
  styleUrls: ['./add-server.component.scss']
})
export class AddServerComponent {
  name="";
  src="";
  constructor(
    public i18n: I18nService,
    public config:ConfigListService,
    public http:HttpClient,
    public _snackBar: MatSnackBar,
    public AddServer:AddServerService,

    ) {

  }

  close() {

  }
  async on() {
    if(this.src){
      const res=await fetch(`${this.src}`)
      if(res.ok){
        let name=""
        if(this.name=="") name=this.src;
        else name=this.name;
        this.config.list_menu_config.server.push({name:name,type:"server",src:this.src,subscriptions:[]});

        this.config.save_list_menu_config();
        this.AddServer.close();
      }else{
        this._snackBar.open("服务器 连接失败~","",{
          duration:1000,
        });
      }
    }else{
      this._snackBar.open("请填写服务器地址","",{
        duration:1000,
      });
    }
  }

  // http://localhost:9880

}
