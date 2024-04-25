import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
declare const window: any;
@Component({
  selector: 'app-local-cache',
  templateUrl: './local-cache.component.html',
  styleUrl: './local-cache.component.scss'
})
export class LocalCacheComponent {
  constructor(public data:DataService) {
  }

  init() {
    this.change(0, 0)
  }

  change(c: number, e: number) {
    this.data.list=[];

    window.comics_query_option.page_num = 1;
    window.comics_query();
  }
  ngAfterViewInit() {
    this.init();
  }
}
