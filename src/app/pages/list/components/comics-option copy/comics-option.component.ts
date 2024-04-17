import { Component } from '@angular/core';
declare const window: any;
@Component({
  selector: 'app-comics-option',
  templateUrl: './comics-option.component.html',
  styleUrls: ['./comics-option.component.scss']
})
export class ComicsOptionComponent {
  order = 1;
  list = [
    {
      id: 1,
      name: "追漫顺序",
      free:0
    },
    {
      id: 2,
      name: "更新时间",
      free:0
    },
    {
      id: 3,
      name: "最近阅读",
      free:0
    },
    {
      id: 4,
      name: "完成等免",
      free:0
    }
  ]
  constructor() {

  }

  init() {
    let local = localStorage.getItem('bilibili_comics_query_order');
    if (local) {
      let order = parseInt(local)
      this.change(order)
    } else {
      this.change(1)
    }
  }

  change(order: number) {
    this.order = order;
    window.comics_query_option.order = order;
    if(order==4) {
      window.comics_query_option.order=3;
      window.comics_query_option.wait_free=1;
    }
    else window.comics_query_option.wait_free=0
    window.comics_query_option.page_num=1;
    localStorage.setItem('bilibili_comics_query_order', order.toString())
    window.comics_query();
    const node=document.querySelector("#comics_list")
    if(node) node.scrollTop=0
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
    window.comics_query_option.page_num=1;
    this.init();
  }
}
