import { Component } from '@angular/core';
declare const window: any;
@Component({
  selector: 'app-comics-ranking',
  templateUrl: './comics-ranking.component.html',
  styleUrls: ['./comics-ranking.component.scss']
})
export class ComicsRankingComponent {

  order = 1;
  list= [
    {
      id: 7,
      type: 0,
      description: '前7日综合指标最高的三个月内上线漫画作品排行',
      name: '新作榜',
    },
    {
      id: 11,
      type: 0,
      description: '前7日综合指标最高的男性向漫画作品排行',
      name: '男生榜',
    },
    {
      id: 12,
      type: 0,
      description: '前7日综合指标最高的女性向漫画作品排行',
      name: '女生榜',
    },
    {
      id: 1,
      type: 0,
      description: '前7日人气最高的国漫作品排行，每日更新',
      name: '国漫榜',
    },
    {
      id: 0,
      type: 0,
      description: '前7日人气最高的日漫作品排行，每日更新',
      name: '日漫榜',
    },
    {
      id: 2,
      type: 0,
      description: '前7日人气最高的韩漫作品排行，每日更新',
      name: '韩漫榜',
    },
    {
      id: 5,
      type: 0,
      description: '前7日人气最高的官方精选漫画作品排行，每日更新',
      name: '宝藏榜',
    },
    {
      id: 13,
      type: 2,
      description: '前365日综合指标最高的完结漫画作品排行',
      name: '完结榜',
    },
  ]
  constructor() {
    window.comics_query_option = {
      query_type:"ranking"
    };
  }

  init() {
    let local = localStorage.getItem('bilibili_comics_query_ranking');
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
    localStorage.setItem('bilibili_comics_query_ranking', order.toString())
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
