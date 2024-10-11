import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  constructor(
    private Current: CurrentService,
    public data: DataService,
  ) {

  }


  async init() {
  }

  on_list($event: any) {

  }

  on_item(e: { $event: HTMLElement, data: any }) {

  }

  ngAfterViewInit() {
  }

  openedChange(bool) {
    //  if(bool){
    //   document.body.setAttribute("locked_region", "menu")
    //  }else{
    //   if (document.body.getAttribute("locked_region") == "menu") document.body.setAttribute("locked_region",document.body.getAttribute("router"))
    //  }

  }
  mouseleave($event: MouseEvent) {
    // if($event.offsetX>24) return
    // if($event.offsetX+24>window.innerHeight) return
    // if(($event.offsetX+13)>window.innerWidth){

    // }else{
    //   this.menu.opened=true;
    // }
    // if($event.offsetX<window.innerWidth){

    // }
  }
  drawer_mouseleave($event: MouseEvent) {
    // if($event.offsetX>240) {
    //   this.menu.opened=false;
    // }
  }
  ngOnDestroy() {
  }



}
