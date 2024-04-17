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
      key: "",
      name: "",
      selected: "",
      tag: [
        {
          id: "",
          name: ""
        }
      ]
    }
  ]
  constructor() {
    let list: any = [];
    const lists = { "code": 0, "msg": "", "data": { "styles": [{ "id": 999, "name": "热血" }, { "id": 997, "name": "古风" }, { "id": 1016, "name": "玄幻" }, { "id": 998, "name": "奇幻" }, { "id": 1023, "name": "悬疑" }, { "id": 1002, "name": "都市" }, { "id": 1096, "name": "历史" }, { "id": 1092, "name": "武侠仙侠" }, { "id": 1088, "name": "游戏竞技" }, { "id": 1081, "name": "悬疑灵异" }, { "id": 1063, "name": "架空" }, { "id": 1060, "name": "青春" }, { "id": 1054, "name": "西幻" }, { "id": 1048, "name": "现代" }, { "id": 1028, "name": "正能量" }, { "id": 1015, "name": "科幻" }], "areas": [{ "id": 1, "name": "大陆" }, { "id": 2, "name": "日本" }, { "id": 6, "name": "韩国" }, { "id": 5, "name": "其他" }], "status": [{ "id": 0, "name": "连载" }, { "id": 1, "name": "完结" }], "orders": [{ "id": 0, "name": "人气推荐" }, { "id": 1, "name": "更新时间" }, { "id": 3, "name": "上架时间" }], "prices": [{ "id": 1, "name": "免费" }, { "id": 2, "name": "付费" }, { "id": 3, "name": "等就免费" }] } };
    lists.data.styles.unshift({ "id": -1, "name": "全部" })
    lists.data.areas.unshift({ "id": -1, "name": "全部" })
    lists.data.prices.unshift({ "id": -1, "name": "全部" })
    lists.data.status.unshift({ "id": -1, "name": "全部" })
    lists.data.orders.unshift({ "id": -1, "name": "全部" })
    list.push({
      key: "styles",
      name: "题材",
      selected: -1,
      tag: lists.data.styles
    })
    list.push({
      key: "areas",
      name: "区域",
      selected: -1,
      tag: lists.data.areas
    })
    list.push({
      key: "status",
      name: "进度",
      selected: -1,
      tag: lists.data.status
    })
    list.push({
      key: "prices",
      name: "收费",
      selected: -1,
      tag: lists.data.prices
    })
    list.push({
      key: "orders",
      name: "排序",
      selected: -1,
      tag: lists.data.orders
    })
    this.list = list;
  }

  init() {
    this.change(0, 0)
  }

  change(c: number, e: number) {
    this.list[c].selected = this.list[c].tag[e].id;
    this.list.forEach(x => {
      if (x.key == "orders") window.comics_query_option.order = x.selected;
      if (x.key == "prices") window.comics_query_option.is_free = x.selected;
      if (x.key == "status") window.comics_query_option.is_finish = x.selected;
      if (x.key == "areas") window.comics_query_option.area_id = x.selected;
      if (x.key == "styles") window.comics_query_option.style_id = x.selected;
    })
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
