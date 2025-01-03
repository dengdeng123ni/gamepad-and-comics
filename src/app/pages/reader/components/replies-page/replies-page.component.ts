import { Component } from '@angular/core';
import { DbComicsControllerService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-replies-page',
  templateUrl: './replies-page.component.html',
  styleUrl: './replies-page.component.scss'
})
export class RepliesPageComponent {

  constructor(
    public DbComicsController:DbComicsControllerService,
    public current:CurrentService,
    public data:DataService
  ) {
    this.init()
  }

  async init() {

    this.list= await this.DbComicsController.getReplies({
      comics_id:this.data.comics_id,
      page_index:1
    },{
      source:this.current.source
    })
  }

  list = []
}
