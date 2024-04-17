import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-edit-toolbar',
  templateUrl: './edit-toolbar.component.html',
  styleUrls: ['./edit-toolbar.component.scss']
})
export class EditToolbarComponent {
  constructor(public data:DataService){

  }
  selectedLength=0;
  closeEdit() {
    this.data.is_edit = !this.data.is_edit;
    // this.current.edit$.next(this.config.edit);
  }
  selectAll() {
    const bool = this.data.list.filter(x => x.selected == true).length == this.data.list.length;
    if (bool) {
      this.data.list.forEach(x => x.selected = false)
    } else {
      this.data.list.forEach(x => x.selected = true)
    }
  }
  selectedDetele(){

  }
  openDownload(){

  }
  ngDoCheck(){
    this.selectedLength=this.data.list.filter(x => x.selected == true).length
  }
}
