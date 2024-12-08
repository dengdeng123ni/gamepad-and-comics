import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageEventService {

  public ServiceWorkerEvents: { [key: string]: Function } = {};
  public PlugEvents: { [key: string]: Function } = {};
  public OtherEvents: { [key: string]: Function } = {};

  constructor() {

  }

  service_worker_register(key:string, callback: Function) {
    this.ServiceWorkerEvents[key] = callback;
  }

  plug_register(key:string, callback: Function) {
    this.PlugEvents[key] = callback;
  }

  other_register(key:string, callback: Function) {
    this.OtherEvents[key] = callback;
  }



}
