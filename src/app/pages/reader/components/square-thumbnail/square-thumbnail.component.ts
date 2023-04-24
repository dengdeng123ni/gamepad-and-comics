import { Component } from '@angular/core';
import { CurrentReaderService } from '../../services/current.service';
import { SquareThumbnailService } from './square-thumbnail.service';

@Component({
  selector: 'app-square-thumbnail',
  templateUrl: './square-thumbnail.component.html',
  styleUrls: ['./square-thumbnail.component.scss']
})
export class SquareThumbnailComponent {

  chapters = [];
  id = null;
  height = (window.innerWidth - (4 * ((Math.floor(((window.innerWidth - 4) / 132))) - 1))) / Math.floor(((window.innerWidth - 4) / 132));


  constructor(
    public current: CurrentReaderService,
    public squareThumbnail:SquareThumbnailService
    ) {
    this.chapters = current.comics.chapters;
    const index = this.current.comics.chapters.findIndex(x => x.id == this.current.comics.chapter.id);
    this.id = current.comics.chapters[index].images[this.current.comics.chapter.index].id;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const node = document.getElementById('square_thumbnail_' + this.id);
      node.scrollIntoView({ block: "center", inline: "center" })
    }, 0)
  }
  on(chapterId,index){
    this.current.chapterPageChange(chapterId, index);

  }
  close(){
    this.squareThumbnail.close();
  }
}
