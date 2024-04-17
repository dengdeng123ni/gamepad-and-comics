import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
declare const window: any;
@Component({
  selector: 'app-temporary-file',
  templateUrl: './temporary-file.component.html',
  styleUrls: ['./temporary-file.component.scss']
})
export class TemporaryFileComponent {
  constructor(public data:DataService) {
  }

  init() {
    this.change(0, 0)
  }

  change(c: number, e: number) {
    this.data.list=[];
    window.comics_query_option.page_num = 1;
    window.comics_query();
    const node = document.querySelector("#comics_list")
    if (node) node.scrollTop = 0
  }
  ngAfterViewInit() {
    const i_w = 172.8;
    const i_h = 276.8;
    const node: any = document.querySelector("#comics_list");
    let w2 = ((node.clientWidth - 32) / i_w);
    let h2 = (node.clientHeight / i_h);
    if (h2 < 1) h2 = 1;
    else h2 = h2 + 1;
    window.comics_query_option.page_size = Math.trunc(h2) * Math.trunc(w2);
    window.comics_query_option.page_num = 1;
    this.init();
  }
}

