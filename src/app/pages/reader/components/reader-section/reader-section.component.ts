import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';
import { ReaderSectionService } from './reader-section.service';

@Component({
  selector: 'app-reader-section',
  templateUrl: './reader-section.component.html',
  styleUrls: ['./reader-section.component.scss']
})
export class ReaderSectionComponent {
  constructor(public current:CurrentReaderService,
    public readerSection:ReaderSectionService,
    public i18n:I18nService
    ){

  }
  ngAfterViewInit() {
   const node:any=document.querySelector(`#_${this.current.comics.chapter.id}`);
   setTimeout(()=>{
    node.focus()
   },0)
  }
  on(e, x) {
    this.readerSection.close();
    this.current.onChaptersItemClick$.next({ event$: e, data: x })
  }
}
