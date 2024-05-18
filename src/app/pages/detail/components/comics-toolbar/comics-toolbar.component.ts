import { Component } from '@angular/core';
import { RoutingControllerService } from 'src/app/library/routing-controller.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-comics-toolbar',
  templateUrl: './comics-toolbar.component.html',
  styleUrl: './comics-toolbar.component.scss'
})
export class ComicsToolbarComponent {

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
