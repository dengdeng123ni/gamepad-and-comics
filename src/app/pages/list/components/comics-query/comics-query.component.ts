import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { ComicsSelectTypeService } from '../comics-select-type/comics-select-type.service';
import { ComicsQueryService } from './comics-query.service';
declare const window: any;
@Component({
  selector: 'app-comics-query',
  templateUrl: './comics-query.component.html',
  styleUrl: './comics-query.component.scss'
})
export class ComicsQueryComponent {
  constructor(
    public ComicsQuery:ComicsQueryService,
    public current: CurrentService,
    public ComicsSelectType: ComicsSelectTypeService
  ) {


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
  }
}
