import { Injectable } from '@angular/core';
import { ContextMenuEventService } from './context-menu-event.service';
import { ContextMenuService } from './context-menu/context-menu.service';
declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class ContextMenuControllerService {
  private handleRegion: string = '';
  private currentNode: HTMLElement | null = null;

  constructor(
    private contextMenuEvent: ContextMenuEventService,
    private contextMenu: ContextMenuService
  ) {
    this.init();
  }

  // 右键菜单打开
  public openContextMenu(node: HTMLElement, x: number, y: number): void {
    this.currentNode = node;
    const key = node.getAttribute('content_menu_key');
    if (!key) return
    let menu = this.contextMenuEvent.menu[key];
    if (!menu) {
      return;
    }
    this.currentNode.setAttribute('content_menu_select', 'true');
    const value = node.getAttribute('content_menu_value');
    this.handleRegion = (document.querySelector('body') as HTMLElement).getAttribute('locked_region') ?? '';
    (document.querySelector('body') as HTMLElement).setAttribute('locked_region', 'content_menu');
    if (this.contextMenuEvent.send[key]) menu = this.contextMenuEvent.send[key].callback(node, menu)
    this.contextMenu.open(menu, { x, y, key: key, value: value ?? "" });
  }
  // 扩容菜单方法
  public openMenu(node: HTMLElement, x: number, y: number): void {
    this.currentNode = node;
    const key = node.getAttribute('menu_key');
    if (!key) return
    let menu = this.contextMenuEvent.menu[key];
    if (!menu) {
      return;
    }
    this.currentNode.setAttribute('menu_select', 'true');
    const value = node.getAttribute('menu_value');
    this.handleRegion = (document.querySelector('body') as HTMLElement).getAttribute('locked_region') ?? '';
    (document.querySelector('body') as HTMLElement).setAttribute('locked_region', 'content_menu');
    if (this.contextMenuEvent.send[key]) menu = this.contextMenuEvent.send[key].callback(node, menu)
    this.contextMenu.open(menu, { x, y, key: key, value: value ?? "" });
  }

  // 初始化右键菜单
  private init(): void {
    const getPath = (node: HTMLElement): HTMLElement[] => {
      const path = [node];
      let parent = node.parentNode as HTMLElement;
      while (parent) {
        path.push(parent);
        parent = parent.parentNode as HTMLElement;
      }
      return path;
    };

    window.addEventListener('contextmenu', (e: any) => {

      if (!e.path) {
        e.path = getPath(e.target);
      }
      for (let i = 0; i < e.path.length; i++) {
        const node = e.path[i];
        if (node.getAttribute && node.getAttribute('content_menu_key')) {
          e.preventDefault();
          const key = node.getAttribute('content_menu_key');
          if (this.contextMenuEvent.openEvent[key]) this.contextMenuEvent.openEvent[key](node);
          this.currentNode = node;
          (this.currentNode as any).setAttribute('content_menu_select', 'true');
          const value = node.getAttribute('content_menu_value');
          let menu = this.contextMenuEvent.menu[key];
          if (menu&&menu.length) {
            if (this.contextMenuEvent.send[key]) menu = this.contextMenuEvent.send[key].callback(node, menu)
            this.contextMenu.open(menu, { x: e.clientX, y: e.clientY, key: key, value: value ?? null });
            break;
          } else {
            break;
          }
        }
      }
    });

    this.contextMenu.afterClosed().subscribe((command: any) => {
      if (command.key) {
        if (this.contextMenuEvent.onEvent[command.key]) this.contextMenuEvent.onEvent[command.key](command);
      }
    });

    this.contextMenu.beforeClosed().subscribe((command: any) => {
      (this.currentNode as any).setAttribute('content_menu_select', 'false');
      if (document.querySelector('body')!.getAttribute('locked_region') == "content_menu") document.querySelector('body')!.setAttribute('locked_region', this.handleRegion);
      if (command.key) {
        if (this.contextMenuEvent.closeEvent[command.key]) this.contextMenuEvent.closeEvent[command.key](command);
      }
    });
  }

  // 关闭右键菜单
  public close(): void {
    this.contextMenu.close();
  }
}
