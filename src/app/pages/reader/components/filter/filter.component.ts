import { Component } from '@angular/core';
import { SvgService } from 'src/app/library/svg.service';
import { FilterService } from './filter.service';

import { IndexdbControllerService } from 'src/app/library/public-api';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  list = [];
  constructor(
    public svg: SvgService,
    public webDb: IndexdbControllerService,
    public Filter: FilterService
  ) {

  }
  async init() {
    this.svg.data=[];
    const node: any = document.querySelector("#svg_1")
    let arr = [
      {
        name: "灰度",
        value: [
          0.213, 0.715, 0.072, 0, 0,
          0.213, 0.715, 0.072, 0, 0,
          0.213, 0.715, 0.072, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "棕褐色",
        value: [
          0.393, 0.769, 0.189, 0, 0,
          0.349, 0.686, 0.168, 0, 0,
          0.272, 0.534, 0.131, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "布朗尼",
        value: [
          0.627, 0.320, 0.075, 0, 0,
          0.299, 0.587, 0.114, 0, 0,
          0.239, 0.469, 0.091, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "反转颜色",
        value: [
          -1, 0, 0, 0, 1,
          0, -1, 0, 0, 1,
          0, 0, -1, 0, 1,
          0, 0, 0, 1, 0
        ]
      },

      {
        name: "柯达胶卷",
        value: [
          1.15, 0.05, 0.05, 0, 0,
          0.05, 1.10, 0.05, 0, 0,
          0.05, 0.05, 1.10, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "宝丽来",
        value: [
          0.3588, 0.7044, 0.1368, 0, 0,
          0.2990, 0.5870, 0.1140, 0, 0,
          0.2392, 0.4696, 0.0912, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
    ]
    const res: any = await this.webDb.getAll('color_matrix')
    arr = [...arr, ...res]

    for (let index = 0; index < arr.length; index++) {
      const x = arr[index];
      this.svg.register(`
        <svg>
        <filter name="${x.name}" x="0%" y="0%" width="100%" height="100%">
        <feColorMatrix type="matrix" values="${x.value.toString()}"/>
        </filter>
        </svg>
        `)
    }

    this.svg.data.forEach((x, index) => {


      this.list.push({
        id: `filter_${index}`,
        name: x.name
      })
    })
  }
  on(index) {
    this.del();
    this.Filter.post({
      innerHTML: this.svg.data[index].innerHTML,
      id: this.svg.data[index].id
    }, 'page')
    this.svg.add2(this.svg.data[index].innerHTML, 'page', document.body);
    this.Filter.close();
  }
  del() {
    this.Filter.del()
    this.svg.del('page');
    this.Filter.close();

  }
  ngAfterViewInit() {
    this.init();
  }





}
