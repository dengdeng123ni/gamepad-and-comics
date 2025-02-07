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

    this.list= await this.DbComicsController.getReplies(this.data.comics_id,{
      source:this.current.source
    })

    console.log(this.list);

  }

  list = []
}
