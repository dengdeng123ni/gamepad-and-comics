import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface MenuItem {
  id: string;
  name: string;
  text: boolean;
  data?: any;
  value:string;
  arg?: {
    key: string;
    parent?: string;
    id: string;
    name: string;
    text: boolean;
    data?: any;
    [key: string]: any;
  };
  submenu?: MenuItem[];
}

interface MenuOptions {
  x: number;
  y: number;
  key: string;
  value: string;
  [key: string]: any;
}

interface MenuParams {
  template: MenuItem[];
  option: MenuOptions;
}

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  public data: MenuItem[] = [];
  public currentKey: string = '';
  public menuEvent!: any;
  public afterClosed$ = new Subject();
  public beforeClosed$ = new Subject();

  constructor() {}

  // 设置菜单事件对象
  registerEvent(menuEvent: any): void {
    this.menuEvent = menuEvent;
  }

  // 打开菜单
  open(menuItems: MenuItem[],menuOptions: MenuOptions,): void {
    this.data = this.generateMenuData(menuItems, menuOptions);
    this.currentKey = menuOptions.key;
    this.menuEvent.open(menuOptions.x, menuOptions.y);
  }

  // 关闭菜单
  close(): void {
    this.beforeClosed$.next("eforeClosed");
    this.afterClosed$.next("afterClosed");
    this.menuEvent.close();
  }

  // 获取菜单关闭后的观察者对象
  afterClosed() {
    return this.afterClosed$;
  }

  // 获取菜单关闭前的观察者对象
  beforeClosed() {
    return this.beforeClosed$;
  }

  // 根据菜单模板和菜单选项生成菜单数据
  private generateMenuData(menuItems: MenuItem[], menuOptions: MenuOptions): MenuItem[] {
    return menuItems.map((menuItem) => {
      if (menuItem.submenu) {
        menuItem.submenu = this.generateMenuData(menuItem.submenu, menuOptions);
      } else {
        menuItem.arg = {
          key: menuOptions.key,
          value: menuOptions.value,
          parent: menuItem.arg?.parent,
          id: menuItem.id,
          name: menuItem.name,
          text: menuItem.text,
          data: menuItem.data
        };
      }
      return menuItem;
    });
  }
}
