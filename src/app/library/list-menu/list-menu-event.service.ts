import { Injectable } from '@angular/core';
interface MenuItem {
  id?: string;
  name: string;
  icon: string;
  getList: Function;
  query: any;
}
interface Config {
  id: string,
  target: string,
}

// source built_in separate

@Injectable({
  providedIn: 'root'
})
export class ListMenuEventService {
  public Content: { [key: string]: Array<MenuItem> } = {};
  public Configs: { [key: string]: Config } = {};
  constructor() {
    let data = [];


    window._gh_list_menu_register=this.register;
  }

  register = (config: Config, content: Array<MenuItem>) => {
    const key = config.id;
    this.Configs[key] = config;
    this.Content[key] = content;
  }
}
