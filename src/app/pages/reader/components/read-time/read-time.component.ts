import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CurrentReaderService } from '../../services/current.service';

@Component({
  selector: 'app-read-time',
  templateUrl: './read-time.component.html',
  styleUrls: ['./read-time.component.scss']
})
export class ReadTimeComponent {
  constructor(
    public db: NgxIndexedDBService,
    public current: CurrentReaderService
  ) {
    this.db.getAll('image_state').subscribe((x: any) => {
      const list = x.filter(x => x.comicsId == this.current.comics.id);
      let millisecond = 0;
      list.forEach(x => {
        millisecond = millisecond + (x.endTime - x.startTime);
      })
      let chapters = {};
      this.current.comics.chapters.forEach(x => {
        const readingTimes = list.filter(c => c.chapterId == x.id)
        let millisecond = 0;
        readingTimes.forEach(x => {
          millisecond = millisecond + (x.endTime - x.startTime);
        })
        chapters[x.id] = {
          ...list.filter(c => c.chapterId == x.id),
          readingTimes,
          millisecond
        }
      })

      const minutes = millisecond / (1000 * 60);
      const hours = millisecond / (1000 * 60 * 60);

    })
  }
}
