import { Component } from '@angular/core';
import { DropDownMenuService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-settings-nine-grid',
  templateUrl: './settings-nine-grid.component.html',
  styleUrl: './settings-nine-grid.component.scss'
})
export class SettingsNineGridComponent {


  list = [];


  arr = [
    {
      id: "bcak",
      name: "返回"
    },
    {
      id: "toggle_page",
      name: "切页"
    },
    {
      id: "chapters_change",
      name: "章节"
    },
    {
      id: "page_thumbnail",
      name: "缩略图"
    },
    {
      id: "comics_settings",
      name: "设置"
    },
    {
      id: "comics_toolbar",
      name: "工具栏"
    },
    {
      id: "next_page",
      name: "下一页"
    },
    {
      id: "previous_page",
      name: "上一页"
    },
    {
      id: "next_chapter",
      name: "下一章节"
    },
    {
      id: "previous_chapter",
      name: "上一章节"
    },
    {
      id: "full",
      name: "全屏"
    },
    {
      id: "none",
      name: "无"
    }
  ]
  constructor(
    public data: DataService,
    public DropDownMenu: DropDownMenuService) {
    this.getAll();

  }

  async on(index) {
    let obj: any = await this.DropDownMenu.open(this.arr);
    if (obj) {
      if (obj.id == "none") {
        this.data.nine_grid[index] = "";
        this.getAll()
      } else {
        this.data.nine_grid[index] = obj.id;
        this.getAll()
      }

    }
  }

  async getAll() {
    this.list = []
    Object.keys(this.data.nine_grid).forEach((e, i) => {
      this.list.push({
        index: i + 1,
        name: this.arr.find(c => c.id == this.data.nine_grid[e])?.name ?? ''
      })
    })

    localStorage.setItem("nine_grid", JSON.stringify(this.data.nine_grid));

  }

}
