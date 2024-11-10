import { Component } from '@angular/core';
import { DropDownMenuService } from './drop-down-menu.service';

@Component({
  selector: 'app-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrl: './drop-down-menu.component.scss'
})
export class DropDownMenuComponent {
  constructor(public ComicsSelectType:DropDownMenuService){

  }
  on(index){
    this.ComicsSelectType.index=index;
    this.ComicsSelectType.close();
  }
}
