import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ContextMenuEventService } from '../context-menu-event.service';
import { ContextMenuService } from '../context-menu/context-menu.service';
import { DropDownMenuService } from '../drop-down-menu/drop-down-menu.service';
interface MenuItem {
  id: string;
  name: string;
  text: boolean;
  data?: any;
  value: string;
  click: Function,
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
  key: string;
  [key: string]: any;
}
@Component({
  selector: 'context-menu-edit',
  templateUrl: './context-menu-edit.component.html',
  styleUrl: './context-menu-edit.component.scss'
})
export class ContextMenuEditComponent {

  @Input() context_menu_key: string = "";
  @Input() list: Array<any> = [];


  @Output() close = new EventEmitter();
  context_menu = [];
  is_all = false;
  selected_length = 0;

  @HostListener('window:click', ['$event'])
  windowClick(event: PointerEvent) {
    this.getIsAll();
    return true
  }
  constructor(
    public contextMenuEvent: ContextMenuEventService,
    public DropDownMenu: DropDownMenuService,
    public contextMenu: ContextMenuService

  ) {
    this.getIsAll();
    setTimeout(() => {
      const menu = this.contextMenuEvent.menu[this.context_menu_key];
      this.context_menu = this.generateMenuData(menu, {
        key:this.context_menu_key,
      })
    })


  }
  async DropDownMenuOpen(list) {
    const e:any = await this.DropDownMenu.open(list)
    if (e) {
      this.contextMenu.afterClosed$.next(e.arg)
    }

  }
  closeEdit() {
    this.close.emit();
  }
  async all() {
    const c = this.list.filter(x => x.selected == true).length

    if (c == this.list.length) {
      this.list.forEach(x => {
        x.selected = false
      })
    } else {
      this.list.forEach(x => {
        x.selected = true
      })
    }
    this.getIsAll();
  }
  on(item) {
    if(item.submenu){
     this.DropDownMenuOpen(item.submenu)
    }else{
      this.contextMenu.afterClosed$.next(item.arg)
    }
  }
  async getIsAll() {
    const c = this.list.filter(x => x.selected == true).length
    this.selected_length = c;

    if (c == this.list.length) {
      this.is_all = true;
    } else {
      this.is_all = false;
    }


  }
  // 根据菜单模板和菜单选项生成菜单数据
  private generateMenuData(menuItems: MenuItem[], menuOptions: MenuOptions): MenuItem[] {
    return menuItems.map((menuItem) => {
      if (menuItem.submenu) {
        menuItem.submenu = this.generateMenuData(menuItem.submenu, menuOptions);
      } else {
        menuItem.arg = {
          key: menuOptions.key,
          parent: menuItem.arg?.parent,
          id: menuItem.id,
          name: menuItem.name,
          text: menuItem.text,
          data: menuItem.data,
          click: menuItem.click
        };
      }
      return menuItem;
    });
  }
}
