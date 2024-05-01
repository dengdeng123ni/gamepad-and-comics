// @ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageFetchService } from '../public-api';
import { Subject } from 'rxjs';
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function;
  Search?: Function
}
interface Config {
  id: string,
  name?: string,
  menu?: Array<any>;
  is_locked?: boolean;
  is_download?:boolean;
  is_cache?: boolean;
}
interface Tab {
  url: string,
  host_names: Array<string>,
}
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class DbEventService {
  public Events: { [key: string]: Events } = {};
  public Configs: { [key: string]: Config } = {};

  public change(){
     return this.change$
  }
  change$=new Subject();


  constructor(
    public http: HttpClient,
    public _http: MessageFetchService,
  ) {

    window._gh_register = this.register;


  }

  register = (config: Config, events: Events) => {
    const key = config.id;
    config = {
      name: key,
      is_cache: false,
      is_download:false,
      ...config
    }
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;

    this.change$.next(config)
  }

}
