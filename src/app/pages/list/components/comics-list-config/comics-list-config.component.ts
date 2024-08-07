import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-comics-list-config',
  templateUrl: './comics-list-config.component.html',
  styleUrl: './comics-list-config.component.scss'
})
export class ComicsListConfigComponent {

   constructor(public data:DataService){

   }
}
