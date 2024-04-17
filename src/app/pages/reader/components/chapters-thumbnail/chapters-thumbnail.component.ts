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
  constructor(
    public current: CurrentService,
    public data:DataService,
    public chaptersThumbnail: ChaptersThumbnailService
  ) {

  }
  on(id:string) {
    this.chaptersThumbnail.close();
    this.current._chapterChange(id);

  }
  change() {
    let node = document.querySelector(`[_id=chapter_item_${this.data.chapter_id}]`);
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
