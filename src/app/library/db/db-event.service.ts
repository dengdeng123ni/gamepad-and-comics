import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageFetchService } from '../public-api';
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function;
}
interface Config {
  name: string,
  tab: Tab,
  is_edit: boolean;
  is_locked: boolean;
  is_cache: boolean;
  is_offprint: boolean;
  is_tab: boolean;
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
  constructor(
    public http: HttpClient,
    public _http: MessageFetchService,
  ) {

    window._gh_register = this.register;
  }

  register = (config: Config, events: Events) => {
    console.log(config);

    const key = config.name;
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
    let proxy_hostnames: { url: string; host_name: string; }[] = []
    Object.keys(this.Configs).forEach(x => this.Configs[x].tab.host_names.forEach(c => proxy_hostnames.push({ url: this.Configs[x].tab.url, host_name: c })));
    if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: "pulg_config", proxy_hostnames: proxy_hostnames, configs: this.Configs })

  }

}
