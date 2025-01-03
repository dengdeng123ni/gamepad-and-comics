import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-to-comics-list',
  templateUrl: './image-to-comics-list.component.html',
  styleUrl: './image-to-comics-list.component.scss'
})
export class ImageToComicsListComponent {
  list = [];
  is_edit=false;
  constructor(@Inject(MAT_DIALOG_DATA) public _data,){
      this.list=this._data.list;
  }
}
