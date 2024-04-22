import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { ComicsSelectTypeService } from '../comics-select-type/comics-select-type.service';
import { ComicsQueryService } from './comics-query.service';
declare const window: any;
@Component({
  selector: 'app-comics-query',
  templateUrl: './comics-query.component.html',
  styleUrl: './comics-query.component.scss'
})
export class ComicsQueryComponent {
  constructor(
    public ComicsQuery:ComicsQueryService,
    public current: CurrentService,
    public ComicsSelectType: ComicsSelectTypeService
  ) {


  }

  ngAfterViewInit() {

  }
}
