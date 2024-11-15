import { Component } from '@angular/core';
import { DbControllerService, HistoryService, RoutingControllerService } from 'src/app/library/public-api';
import { HistoryComicsListService } from './history-comics-list.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
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
    public webDb: NgxIndexedDBService,
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

