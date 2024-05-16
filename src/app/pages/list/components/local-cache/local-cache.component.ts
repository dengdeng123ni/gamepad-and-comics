import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { QueryEventService } from 'src/app/library/public-api';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-local-cache',
  templateUrl: './local-cache.component.html',
  styleUrl: './local-cache.component.scss'
})
export class LocalCacheComponent {
  constructor(public data:DataService,
    public webDb: NgxIndexedDBService,
    public QueryEvent:QueryEventService
    ) {


  }
}
