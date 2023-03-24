import { Component, OnInit } from '@angular/core';
import { CurrentReaderService } from '../../services/current.service';
import { SectionService } from './section.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  list=[];
  constructor(
    public current: CurrentReaderService,
    public section: SectionService
  ) {
    this.list = this.current.comics.chapters

  }
  on(id) {
    this.current.chapterChange(id);
    this.section.close();
  }
  change() {
    let node = document.querySelector(`[_id=section_${this.current.comics.chapter.id}]`);
    node.scrollIntoView({ block: "center", inline: "center" })
  }
  ngOnDestroy() {
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.change()
   }

}
