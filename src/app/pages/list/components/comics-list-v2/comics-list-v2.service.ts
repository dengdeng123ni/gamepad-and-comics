import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
interface Events {
  Init: Function;
  Add: Function;
}
interface Config {
  id: string,
  type:string,
  page_size?: number
}
@Injectable({
  providedIn: 'root'
})
export class ComicsListV2Service {

  public Configs: { [key: string]: Config } = {};

  public Events: { [key: string]: Events } = {};


  public _data={}
  constructor( public router: Router,) {
  }


  register = (config: Config, events: Events) => {
    const key = config.id;
    config = {
      id: key,
      type:config.type,
      page_size: config.page_size ?? 20
    }
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Configs[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
  }

  async init(key: string, option) {
    option.page_size = this.Configs[key]?.page_size ??20;
    return await this.Events[key].Init(option)
  }

  async add(key: string, option) {
    option.page_size = this.Configs[key]?.page_size ??20;
    return await this.Events[key].Add(option)
  }
}
