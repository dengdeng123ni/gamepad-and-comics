import { Injectable } from '@angular/core';
interface Config {
  name: string,
  event: Function,
  key?: string,
  router:string,
  icon: string,
  shortcut_key?: {
    keyboard?: Array<Array<string>>,
    gamepad?: {
      position: string,
      index: number,
    },
    trigger_voice?: Array<string>
  },
}
@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: Record<string, Config> = {

  }

  constructor() { }

  register(key: string, config: Config) {
    config.key = key;
    // const router=document.body.getAttribute('router')
    // config['router']=router;
    this.events[key] = config;
  }



}
