import { Component } from '@angular/core';
declare const window: any;
@Component({
  selector: 'app-comics-update',
  templateUrl: './comics-update.component.html',
  styleUrls: ['./comics-update.component.scss']
})
export class ComicsUpdateComponent {

  order = "";
  list = [
    {
      id: "",
      name: "周一",
    },
    {
      id: "",
      name: "周二",
    },
    {
      id: "",
      name: "周三",
    },
    {
      id: "",
      name: "周四",
    },
    {
      id: "",
      name: "周五",
    },
    {
      id: "",
      name: "周六",
    },
    {
      id: "",
      name: "周日",
    }
  ]
  constructor() {
    window.comics_query_option = {
      query_type: "update"
    };

  }

  init() {
    // this.change(this.formaData(this.order))
    var week = new Date().getDay()-1;
    var week2 = new Date().getDay()-1;
    let date=new Date();
    let date2=new Date();
    for (week; week < this.list.length; week++) {
      this.list[week].id=this.formaData(date);
      date=this.getNextDaily(date);
      date=this.getPreviousWeek(date);
    }
    for (week2; week2 > -1; week2--) {
      this.list[week2].id=this.formaData(date2);
      date2=this.getPreviousDaily(date2);
    }
    var week3 = new Date().getDay()-1;
    this.change(this.list[week3].id)
  }
  getPreviousDaily(date:Date) {
    date.setTime(date.getTime() - 24 * 3600 * 1000);
    return date
  }
  getPreviousWeek(date:Date) {
    date.setTime(date.getTime() - 24 * 3600 * 1000*7);
    return date
  }
  getNextDaily(date:Date) {
    date.setTime(date.getTime() + 24 * 3600 * 1000);
    return date
  }
  formaData(timer: any) {
    const pad = (timeEl: any, total = 2, str = '0') => {
      return timeEl.toString().padStart(total, str)
    }
    const year = timer.getFullYear()
    const month = timer.getMonth() + 1 // 由于月份从0开始，因此需加1
    const day = timer.getDate()
    const hour = timer.getHours()
    const minute = timer.getMinutes()
    const second = timer.getSeconds()
    return `${pad(year, 4)}-${pad(month)}-${pad(day)}`
  }

  change(order: string) {
    this.order = order;
    window.comics_query_option.date = order;
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
