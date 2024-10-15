import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comics-list-v11',
  templateUrl: './comics-list-v11.component.html',
  styleUrl: './comics-list-v11.component.scss'
})
export class ComicsListV11Component {
  list = [];
  is_edit=false;
  constructor(@Inject(MAT_DIALOG_DATA) public _data,){
      this.list=this._data.list;
  }
}
