import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reader-config',
  templateUrl: './reader-config.component.html',
  styleUrls: ['./reader-config.component.scss']
})
export class ReaderConfigComponent {
  constructor(public data:DataService){
console.log(data);

  }
  change(e){
    this.data.comics_config.reader_mode=e;
  }
  change1(e){
    this.data.comics_config.is_double_page=e;
  }
  change2(e){
    this.data.comics_config.is_page_order=e;
  }
  // reader_mode = "";
  // is_double_page = true;
  // is_page_order = true;

  //
}
