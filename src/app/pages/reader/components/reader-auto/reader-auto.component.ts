import { Component } from '@angular/core';
import { ReaderAutoService } from './reader-auto.service';
import { CurrentReaderService } from '../../services/current.service';

@Component({
  selector: 'app-reader-auto',
  templateUrl: './reader-auto.component.html',
  styleUrls: ['./reader-auto.component.scss']
})
export class ReaderAutoComponent {

  time = 0;

  duration = 40;

  progress = 0;

  isPause = false;

  isExist = false;

  page$ = null;

  constructor(public current: CurrentReaderService) {
    this.isExist = true;
    this.cycle();
    this.page$ = this.current.page().subscribe(() => {
      this.time = 0;
    })
  }

  start() {

  }

  change() {
    this.isPause = !this.isPause;
  }

  pause() {
    this.isPause = true;
  }

  continue() {
    this.isPause = false;
  }

  end() {
    this.current.nextPage$.next(true);
  }

  cycle() {
    setTimeout(() => {
      if (!this.isExist) return
      this.cycle();
      if (this.isPause) return
      if (document.body.getAttribute("locked_region") != "all") return
      this.time++;
      this.progress = (Math.round(this.time / this.duration * 10000) / 100.00);
      if (this.progress == 100) this.end()
    }, 1000)
  }
  ngOnDestroy() {
    this.isExist = false;
    this.page$.unsubscribe();
  }
}
