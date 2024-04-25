import { Component } from '@angular/core';
import { DbControllerService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-comics-search',
  templateUrl: './comics-search.component.html',
  styleUrl: './comics-search.component.scss'
})
export class ComicsSearchComponent {
   constructor(public DbController: DbControllerService,public data:DataService){
    console.log(this.init());

   }


   init() {
    // this.change(this.formaData(this.order))
    let list = [
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
    var week = new Date().getDay()-1;
    var week2 = new Date().getDay()-1;
    let date=new Date();
    let date2=new Date();
    const getPreviousDaily=(date:Date)=> {
      date.setTime(date.getTime() - 24 * 3600 * 1000);
      return date
    }
    const getPreviousWeek=(date:Date)=> {
      date.setTime(date.getTime() - 24 * 3600 * 1000*7);
      return date
    }
    const getNextDaily=(date:Date)=> {
      date.setTime(date.getTime() + 24 * 3600 * 1000);
      return date
    }
    const formaData=(timer: any)=> {
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
    for (week; week < list.length; week++) {
      list[week].id=formaData(date);
      date=getNextDaily(date);
      date=getPreviousWeek(date);
    }
    for (week2; week2 > -1; week2--) {
      list[week2].id=formaData(date2);
      date2=getPreviousDaily(date2);
    }
    var week3 = new Date().getDay()-1;
    console.log(list);

  }
   utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }


}
