import { Component } from '@angular/core';
import { DbControllerService, HistoryService, IndexdbControllerService, RoutingControllerService } from 'src/app/library/public-api';
import { HistoryComicsListService } from './history-comics-list.service';


import { Router } from '@angular/router';

@Component({
  selector: 'app-history-comics-list',
  templateUrl: './history-comics-list.component.html',
  styleUrl: './history-comics-list.component.scss'
})
export class HistoryComicsListComponent {
  list = [];

  constructor(public history: HistoryService,
    public DbController: DbControllerService,
    public webDb: IndexdbControllerService,
    public RoutingController:RoutingControllerService,
    public router: Router,
    public HistoryComicsList: HistoryComicsListService)
     {
    this.init();
  }
  async init() {
    this.list = (await this.history.getAll()).sort((a: any, b: any) => a.last_read_date - b.last_read_date).reverse();

  }
  on_list(e) {

  }
  close() {
    this.HistoryComicsList.close();

  }
  on(e) {
    this.RoutingController.routerReader(e.source, e.id)

  }
}

