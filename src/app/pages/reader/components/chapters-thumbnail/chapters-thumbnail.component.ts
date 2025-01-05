import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { ChaptersThumbnailService } from './chapters-thumbnail.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chapters-thumbnail',
  templateUrl: './chapters-thumbnail.component.html',
  styleUrls: ['./chapters-thumbnail.component.scss']
})
export class ChaptersThumbnailComponent {
  is_locked = true;
  chapter_index=0;
  constructor(
    public current: CurrentService,
    public data:DataService,
    public chaptersThumbnail: ChaptersThumbnailService
  ) {

    if (this.data.chapters[0].is_locked === undefined || !this.data.is_locked) this.is_locked = false;
    this.chapter_index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
  }
  on(id:string) {
    this.chaptersThumbnail.close();
    this.current._chapterChange(id);

  }
  change() {
    const index=this.data.chapters.findIndex(x=>x.id==this.data.chapter_id)
    let node = document.querySelector(`[_id=chapters_item_${index}]`);
    node!.scrollIntoView({behavior: 'instant', block: "center", inline: "center" })
  }
  ngOnDestroy() {
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.change()
   }
}
