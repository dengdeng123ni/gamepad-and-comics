import { Component } from '@angular/core';
import { AppDataService, HistoryService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
declare const window: any;
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  constructor(public data:DataService,
    public history:HistoryService,
    public AppData:AppDataService
    ) {
  }

  init() {
    this.change()
  }

  async change() {
    this.data.list=[];
    this.data.list= (await this.history.getAll() as any).filter(x=>x.origin==this.AppData.origin);
    const node = document.querySelector("#comics_list")
    if (node) node.scrollTop = 0
  }
  ngAfterViewInit() {
    this.init();
  }

}
