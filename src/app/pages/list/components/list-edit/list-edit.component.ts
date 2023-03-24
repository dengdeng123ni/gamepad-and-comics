import { Component } from '@angular/core';
import { CurrentListService } from '../../services/current.service';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss']
})
export class ListEditComponent {
   constructor(public current:CurrentListService){

   }
}
