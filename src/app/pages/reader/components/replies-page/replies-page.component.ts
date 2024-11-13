import { Component } from '@angular/core';
import { DbControllerService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-replies-page',
  templateUrl: './replies-page.component.html',
  styleUrl: './replies-page.component.scss'
})
export class RepliesPageComponent {

  constructor(
    public DbController:DbControllerService,
    public current:CurrentService,
    public data:DataService
  ) {
    this.init()
  }

  async init() {
    console.log(213);

    this.list= await this.DbController.getReplies({
      comics_id:this.data.comics_id,
      page_index:1
    },{
      source:this.current.source
    })
  }

  list = []
}
