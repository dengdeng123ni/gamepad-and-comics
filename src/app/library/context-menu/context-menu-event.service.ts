import { Injectable } from '@angular/core';
interface MenuItem {
  id: string;
  name: string;
  data?: any;
  click?: Function,
  submenu?: MenuItem[];
}
@Injectable({
  providedIn: 'root'
})
export class ContextMenuEventService {

  public closeEvent: { [key: string]: Function } = {};
  public openEvent: { [key: string]: Function } = {};
  public sendEvent: { [key: string]: Function } = {};
  public onEvent: { [key: string]: Function } = {};

  public menu: { [key: string]: any } = {};
  constructor() {

  }

  register(key: string, { close, open, menu, send, on }: { close?: Function, open?: Function, menu?: Array<MenuItem>, send?: Function, on?: Function }) {
    if (close) this.close(key, close)
    if (open) this.open(key, open)
    if (on) this.on(key, on)
    if (send) this.send(key, send)
    if (menu) this.onMenu(key, menu)
  }

  registerMenu(key: string, menu: Array<MenuItem>) {
    if (!this.menu[key]) this.menu[key] = [];
    for (let index = 0; index < menu.length; index++) {
      this.logoutMenu(key, menu[index].id)
    }
    this.menu[key] = [...this.menu[key], ...menu]
  }

  logoutMenu(key: string, menuId: string) {
    if (!this.menu[key]) return
    this.menu[key] = this.menu[key].filter(x => x.id != menuId)
  }

  onMenu(key: string, content: Array<MenuItem>) {
    this.menu[key] = content;
  }


  close(key: string, callback: Function) {
    this.closeEvent[key] = callback;
  }

  open(key: string, callback: Function) {
    this.openEvent[key] = callback;
  }

  send(key: string, callback?: Function) {
    this.sendEvent[key] = callback
  }

  on(key: string, callback: Function) {
    this.onEvent[key] = callback;
  }
}
