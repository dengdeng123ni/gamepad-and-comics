import { Component } from '@angular/core';
import { DbEventService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { UrlToComicsIdService } from './url-to-comics-id.service';

@Component({
  selector: 'app-url-to-comics-id',
  templateUrl: './url-to-comics-id.component.html',
  styleUrl: './url-to-comics-id.component.scss'
})
export class UrlToComicsIdComponent {
  constructor(
    public DbEvent: DbEventService,
    public current: CurrentService,
    public urlToComicsId: UrlToComicsIdService
  ) {
  }
  on(o, i) {
    this.urlToComicsId.close();
    this.current.routerReader(o, i)

  }

}
