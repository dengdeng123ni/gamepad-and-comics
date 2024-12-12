import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


interface Events {
  sendMessage: Function;
  getAll: Function
}
interface Config {
  id: string,
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class ReplaceChannelEventService {

  public Events: { [key: string]: Events } = {};
  public Configs: { [key: string]: Config } = {};

  public add() {
    return this.add$
  }
  add$ = new Subject();

  constructor() {

  }
  register = (config: Config, events: Events) => {
    const key = config.id;
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
    this.add$.next(key)
  }


}
