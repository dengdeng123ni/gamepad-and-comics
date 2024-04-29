import { Injectable } from '@angular/core';
import { QueryEventService } from './query-event.service';

@Injectable({
  providedIn: 'root'
})
export class QueryControllerService {

  constructor(public QueryEvent:QueryEventService) {

  }

  async add(key:string,option) {
     return await this.QueryEvent.Events[key].Add(option)
  }

  async init(key:string,option) {


    return await this.QueryEvent.Events[key].Init(option)
 }

}
