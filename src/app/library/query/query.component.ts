import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppDataService, DbControllerService, DbEventService, QueryService } from '../public-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  _keyword = "";
  get keyword() { return this._keyword };
  set keyword(value: string) {
    this.ccc(value);

    this._keyword = value;

  }
  filteredOptions: Observable<string[]> | undefined;
  constructor(
    public query: QueryService
  ) {

  }

  async ccc(value){
    const cc= await this.query.getComicsId(value)
    if(cc) this.query.close();
  }
}
