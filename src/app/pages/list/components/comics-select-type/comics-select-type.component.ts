import { Component } from '@angular/core';
import { ComicsSelectTypeService } from './comics-select-type.service';

@Component({
  selector: 'app-comics-select-type',
  templateUrl: './comics-select-type.component.html',
  styleUrls: ['./comics-select-type.component.scss']
})
export class ComicsSelectTypeComponent {
  constructor(public ComicsSelectType:ComicsSelectTypeService){

  }
  on(index){
    this.ComicsSelectType.index=index;
    this.ComicsSelectType.close();
  }
}
