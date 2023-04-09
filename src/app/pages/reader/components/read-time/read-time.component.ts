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
  cover: any = {

  };
  left=false;
  index=0;
  constructor(
    public db: NgxIndexedDBService,
    public readTime: ReadTimeService,
    public current: CurrentReaderService
  ) {
    this.db.getAll('image_state').subscribe((x: any) => {
      const list = x.filter(x => x.comicsId == this.current.comics.id && x.endTime && x.startTime && (x.endTime - x.startTime) > 2000 &&  (x.endTime - x.startTime) < 120000);
      let millisecond = 0;
      list.forEach(x => {
        millisecond = millisecond + (x.endTime - x.startTime);

      })
      let chapters = {};

      this.current.comics.chapters.forEach((b,i)=> {
        const readingTimes = list.filter(c => c.chapterId == b.id)
        let millisecond = 0;
        b.images.forEach((c:any)=>{
          c.readingTimes=readingTimes.filter(x=> x.imageId==c.id);
          c.millisecond=0;
          c.readingTimes.forEach(x => {
            x.millisecond=Math.ceil((x.endTime - x.startTime) / (1000 ));
            c.millisecond = c.millisecond + (x.endTime - x.startTime);
          })
          c.millisecond=Math.ceil(c.millisecond / (1000 ));
        })
        readingTimes.forEach(x => {
          millisecond = millisecond + (x.endTime - x.startTime);
        })
        const minutes = Math.ceil(millisecond / (1000 * 60));

        const hours = millisecond / (1000 * 60 * 60);


        chapters[b.id] = {
          ...b,
          readingTimes,
          minutes,
          hours,
          millisecond
        }

      })


      this.chapters = Object.keys(chapters).map(x => chapters[x]);
      this.cover = this.current.comics.cover;
      this.cover.minutes = Math.ceil(millisecond / (1000 * 60));
      this.cover.hours = millisecond / (1000 * 60 * 60);

    })
  }
  ngAfterViewInit() {
    setTimeout(() => {
      let node = document.getElementById(`${this.current.comics.chapter.id}`);
      node.focus();
      document.getElementById("reading_time").classList.remove("opacity-0");
      node.scrollIntoView({ block: "center", inline: "center" })
    }, 300)
  }
  close() {
    this.readTime.close();
  }
  open(index){
    this.left=true;
    this.index=index;
  }
  closedStart(){
    this.left=false;
  }
}
