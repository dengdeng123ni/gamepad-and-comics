import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageEventService {

  public ServiceWorkerEvents: { [key: string]: Function } = {};
  public PlugEvents: { [key: string]: Function } = {};

  constructor() { }

  service_worker_register(key, callback: Function) {
    this.ServiceWorkerEvents[key] = callback;
  }

  plug_register(key, callback: Function) {
    this.PlugEvents[key] = callback;
  }

}
