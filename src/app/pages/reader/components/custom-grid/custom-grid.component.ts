import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-grid',
  templateUrl: './custom-grid.component.html',
  styleUrls: ['./custom-grid.component.scss']
})
export class CustomGridComponent {
  list: any = [];
  num=9;
  // 3 4 5 6 7
  constructor() {
    this.init();
  }

  init() {
    this.getList(this.num);
  }


  getList(num: number) {
    for (let index = 0; index < num; index++) {
      this.list.push({
        index: index
      })
    }
  }
}
