import { Injectable } from '@angular/core';
interface Events {
  Init: Function;
  Add: Function;
}
interface Config {
  id: string,
}
@Injectable({
  providedIn: 'root'
})
export class QueryEventService {

  public Configs: { [key: string]: Config } = {};

  public Events: { [key: string]: Events } = {};

  constructor() { }


  register = (config: Config, events: Events) => {
    const key = config.id;
    config = {
      id: key,
    }
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
  }
}
