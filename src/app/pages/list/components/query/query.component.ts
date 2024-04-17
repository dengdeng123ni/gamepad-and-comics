import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  _keyword = "";
  get keyword() { return this._keyword };
  set keyword(value: string) {
    // this.current.search(value);
    this._keyword = value;
  }
  filteredOptions: Observable<string[]> | undefined;
}
