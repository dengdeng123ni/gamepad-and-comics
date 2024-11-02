import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrl: './chapters-list.component.scss'
})
export class ChaptersListComponent {


  constructor(public data:DataService){

  }

  on(e){

  }
}
