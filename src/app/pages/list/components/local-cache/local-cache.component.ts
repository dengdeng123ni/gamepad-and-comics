import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

import { IndexdbControllerService, QueryEventService } from 'src/app/library/public-api';

@Component({
  selector: 'app-local-cache',
  templateUrl: './local-cache.component.html',
  styleUrl: './local-cache.component.scss'
})
export class LocalCacheComponent {
  constructor(public data:DataService,
    public webDb: IndexdbControllerService,
    public QueryEvent:QueryEventService
    ) {


  }
}
