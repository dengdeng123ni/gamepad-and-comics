import { Component, Inject, Optional } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SelectInputNumberService } from './select-input-number.service';

@Component({
  selector: 'app-select-input-number',
  templateUrl: './select-input-number.component.html',
  styleUrl: './select-input-number.component.scss'
})
export class SelectInputNumberComponent {
  list=[];
  constructor(
   @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data,
   public SelectInputNumber:SelectInputNumberService
){

     for (let index = data.min; index <= data.max; index++) {
        this.list.push(index)
     }
  }

  on(index){
    this.SelectInputNumber.value=index;
    this.SelectInputNumber.opened = false;
  }
}
