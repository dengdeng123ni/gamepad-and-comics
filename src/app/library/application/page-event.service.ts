import { Injectable } from '@angular/core';
interface Config {
  region:Array<string>,
  queryStr?:string
}
@Injectable({
  providedIn: 'root'
})
export class PageEventService {
  public configs: Record<string, Config> = {};

  constructor() { }

  register(key: string, config: Config): void {
    const list=config.region;
    const str=list.map(x=>`[region=${x}]`).toString();
    config.queryStr=str;
    this.configs[key] = config;
  }
}
