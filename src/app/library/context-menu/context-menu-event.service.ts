import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuEventService {

  public closeEvent: { [key: string]: Function } = {};
  public openEvent: { [key: string]: Function } = {};
  public sendEvent: { [key: string]: { context: any, callback?: Function } } = {};
  public onEvent: { [key: string]: Function } = {};

  constructor() {

   }

  register(key: string, { close, open, menu, send, on }: { close?: Function, open?: Function, menu: any, send?: Function, on?: Function }) {
    if(close) this.close(key,close)
    if(open) this.open(key,open)
    if(on) this.on(key,on)
    if (menu) this.send(key, menu, send)
  }

  close(key: string, callback: Function) {
    this.closeEvent[key] = callback;
  }

  open(key: string, callback: Function) {
    this.openEvent[key] = callback;
  }

  send(key: string, context: any, callback?: Function) {
    this.sendEvent[key] = { context, callback };
  }

  on(key: string, callback: Function) {
    this.onEvent[key] = callback;
  }
}
