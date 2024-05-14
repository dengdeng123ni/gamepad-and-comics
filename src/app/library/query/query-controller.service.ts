import { Injectable } from '@angular/core';
import { QueryEventService } from './query-event.service';

@Injectable({
  providedIn: 'root'
})
export class QueryControllerService {

  constructor(public QueryEvent: QueryEventService) {

  }

  async add(key: string, option) {
    if (this.QueryEvent.Configs[key].page_size) option.page_size = this.QueryEvent.Configs[key].page_size
    return await this.QueryEvent.Events[key].Add(option)
  }

  async init(key: string, option) {
    if (this.QueryEvent.Configs[key].page_size) option.page_size = this.QueryEvent.Configs[key].page_size;
    return await this.QueryEvent.Events[key].Init(option)
  }

}
