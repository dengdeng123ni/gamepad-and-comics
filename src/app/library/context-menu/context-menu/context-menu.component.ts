import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuControllerService } from '../context-menu-controller.service';
import { ContextMenuService } from './context-menu.service';

@Component({
  selector: 'lib-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})

export class ContextMenuComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public contextMenu: ContextMenuService,
    public ContextMenuController:ContextMenuControllerService,
    ) {
    this.contextMenu.registerEvent({
      open:this.open,
      close:()=>this.menu.closeMenu()
    });



  }

  ngOnInit(): void {

  }
  close = () => {
    this.contextMenu.beforeClosed$.next({ key: this.contextMenu.currentKey })
  }
  open = (x:number, y:number) => {
    setTimeout(() => {
      let node = (document.getElementById(`menu_content`) as any);
      node.style.top = `${y}px`;
      node.style.left = `${x}px`;
      this.menu.openMenu();
    })
  }
  on($event,data){
   this.contextMenu.afterClosed$.next({...data,PointerEvent:$event,'trigger':"contextmenu"})
  }
  submenuOpen(e:any) {
    e.stopPropagation();
    e.target.children[0].click();
  }



}
