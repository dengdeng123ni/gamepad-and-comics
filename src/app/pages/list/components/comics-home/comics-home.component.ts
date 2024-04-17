import { Component } from '@angular/core';

declare const window: any;
@Component({
  selector: 'app-comics-home',
  templateUrl: './comics-home.component.html',
  styleUrls: ['./comics-home.component.scss']
})
export class ComicsHomeComponent {

    order = 1;
    list= [
    {
      type: 3,
      id: 1042,
      name: '二次元养老院',
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
