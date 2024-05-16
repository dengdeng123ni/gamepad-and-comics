import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { DbControllerService, QueryEventService } from 'src/app/library/public-api';
declare const window: any;
@Component({
  selector: 'app-temporary-file',
  templateUrl: './temporary-file.component.html',
  styleUrls: ['./temporary-file.component.scss']
})
export class TemporaryFileComponent {
  list = [];
  id = '';
  name = '';
  constructor(public data: DataService,
    public route: ActivatedRoute,
    public DbController: DbControllerService,
    public QueryEvent: QueryEventService
  ) {

    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(x => {
      this.id = x.get("id");
      const params = new URLSearchParams(window.location.search);
      this.name = params.get("name");

    })

  }
  async getList() {
  }
  utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
}

