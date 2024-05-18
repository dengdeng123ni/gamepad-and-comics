import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { RoutingControllerService } from 'src/app/library/routing-controller.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
constructor(public data:DataService,public current:CurrentService,
  public RoutingController:RoutingControllerService
){}
back() {
  this.RoutingController.navigate('list')
}
continue() {
  this.current.routerReader(this.data.comics_id, this.data.chapter_id)
}
}
