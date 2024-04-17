import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { ReaderChangeService } from './reader-change.service';

@Component({
  selector: 'app-reader-change',
  templateUrl: './reader-change.component.html',
  styleUrls: ['./reader-change.component.scss']
})
export class ReaderChangeComponent {
  constructor(public data: DataService,
    public ReaderChange:ReaderChangeService,
    public current: CurrentService) { }

  change(e: string) {
    this.current.reader_mode_change$.next(e)
    this.ReaderChange.close();
  }
}
