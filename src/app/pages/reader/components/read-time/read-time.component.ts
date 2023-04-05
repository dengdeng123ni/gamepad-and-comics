import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CurrentReaderService } from '../../services/current.service';
import { ReadTimeService } from './read-time.service';

@Component({
  selector: 'app-read-time',
  templateUrl: './read-time.component.html',
  styleUrls: ['./read-time.component.scss']
})
export class ReadTimeComponent {
  chapters = [];
  cover:any={

  };
  constructor(
    public db: NgxIndexedDBService,
    public readTime:ReadTimeService,
    public current: CurrentReaderService
  ) {
    this.db.getAll('image_state').subscribe((x: any) => {
      const list = x.filter(x => x.comicsId == this.current.comics.id && x.endTime && x.startTime);
      let millisecond = 0;
      list.forEach(x => {
        if ((x.endTime - x.startTime) > 2000 && x.startTime && x.endTime && (x.endTime - x.startTime) < 120000) {
          millisecond = millisecond + (x.endTime - x.startTime);
        }else{

        }

      })
      let chapters = {};

      this.current.comics.chapters.forEach(x => {
        const readingTimes = list.filter(c => c.chapterId == x.id)
        let millisecond = 0;
        readingTimes.forEach(x => {
          if ((x.endTime - x.startTime) > 2000 && x.startTime && x.endTime && (x.endTime - x.startTime) < 120000) {
          millisecond = millisecond + (x.endTime - x.startTime);
          }else{

          }
        })
        const minutes = Math.ceil(millisecond / (1000 * 60));
        const hours = millisecond / (1000 * 60 * 60);
        chapters[x.id] = {
          ...x,
          ...list.filter(c => c.chapterId == x.id),
          readingTimes,
          minutes,
          hours,
          millisecond
        }
      })

      this.chapters = Object.keys(chapters).map(x => chapters[x]);
      this.cover=this.current.comics.cover;
      this.cover.minutes = Math.ceil( millisecond / (1000 * 60));
      this.cover.hours = millisecond / (1000 * 60 * 60);

    })
  }
  ngAfterViewInit() {
    setTimeout(()=>{
      let node = document.getElementById(`${this.current.comics.chapter.id}`);
      node.focus();
      document.getElementById("reading_time").classList.remove("opacity-0");
    node.scrollIntoView({ block: "center", inline: "center" })
    },300)
  }
  close(){
this.readTime.close();
  }

}
