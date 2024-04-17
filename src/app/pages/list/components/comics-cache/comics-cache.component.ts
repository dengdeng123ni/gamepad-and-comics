import { Component } from '@angular/core';
declare const window: any;
@Component({
  selector: 'app-comics-cache',
  templateUrl: './comics-cache.component.html',
  styleUrls: ['./comics-cache.component.scss']
})
export class ComicsCacheComponent {
  order = 1;
  list= [
  {
    type: 3,
    id: 1042,
    name: '',
    color: '',
    data_type: 1,
    strategy_id: [],
  },
  {
    type: 3,
    id: 1044,
    name: '9.0分以上佳作精选',
    color: '',
    data_type: 1,
    strategy_id: [],
  },
]

  constructor() {
    window.comics_query_option = {
      query_type:"home"
    };

  }

  init() {
    let local = localStorage.getItem('bilibili_comics_query_home');
    if (local) {
      let order = parseInt(local)
      this.change(order)
    } else {
      this.change(this.list[0].id)
    }
  }

  change(order: number) {
    this.order = order;
    window.comics_query_option.id = order;
    window.comics_query_option.page_num = 1;
    localStorage.setItem('bilibili_comics_query_home', order.toString())

    const node = document.querySelector("#comics_list")
    if (node) node.scrollTop = 0
  }
  ngAfterViewInit() {
    window.comics_query();
  }
}
