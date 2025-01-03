import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DbComicsControllerService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-comics-offprint-thumbnail',
  templateUrl: './comics-offprint-thumbnail.component.html',
  styleUrls: ['./comics-offprint-thumbnail.component.scss']
})
export class ComicsOffprintThumbnailComponent {
  list = []
  constructor(public data: DataService,public current:CurrentService, public DbComicsController: DbComicsControllerService,) {
    this.getList(this.data.chapters[0].id)

  }
  async getList(id) {
    const list = await this.DbComicsController.getPages(id);

    this.list = list;
  }

  on(index){
    this.current._chapterPageChange(this.data.chapter_id, index);
  }
}
