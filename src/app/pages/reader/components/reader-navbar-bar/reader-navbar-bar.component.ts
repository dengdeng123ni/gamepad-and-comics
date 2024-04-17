import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { bufferCount, Subject, throttleTime } from 'rxjs';
import { ReaderSectionService } from '../reader-section/reader-section.service';
import { ReaderNavbarBarService } from './reader-navbar-bar.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reader-navbar-bar',
  templateUrl: './reader-navbar-bar.component.html',
  styleUrls: ['./reader-navbar-bar.component.scss']
})
export class ReaderNavbarBarComponent implements OnInit {
  opened = false;
  zIndex = -1;

  // _index=this.current.comics.chapter.index

  public set index(v: number) {

    this.change$.next(v)
  }
  public get index() {
    return this.data.page_index
  }


  change$ = new Subject<number>();
  readerNavbarBarChange$;
  chapter_index=0;
  constructor(
    public readerNavbarBar: ReaderNavbarBarService,
    public current: CurrentService,
    public router: Router,
    public data: DataService,
    public readerSection: ReaderSectionService
  ) {
    this.readerNavbarBarChange$ = this.readerNavbarBar.change().subscribe(x => {
      if (x == true) {
        this.chapter_index=data.chapters.findIndex(x=>x.id==data.chapter_id)
        this.opened = true;
        this.zIndex = 500;
      } else {
        this.opened = false;
        setTimeout(() => {
          if (!this.opened) {
            this.zIndex = -1;
            // this.GamepadController.device("DOWN")
          }
        }, 300)
      }
    });

    this.change$.pipe(throttleTime(50)).subscribe(x => {
      this.change(x)
    })

    // reader_navbar_bar_buttom_item_progress

  }

  ngOnInit(): void {
  }
  change(e: any): void {
    if (e == this.data.pages.length) e--
    this.current._pageChange(e)
  }
  routerList() {
    this.router.navigate(['/']);
  }
  routerDetail() {
    this.router.navigate(['/detail', this.data.comics_id]);
  }

  ngOnDestroy() {
    this.readerNavbarBarChange$.unsubscribe();
    this.change$.unsubscribe();
    this.close();
  }
  close() {
    this.readerNavbarBar.close();
  }
  switchChnage() {
    this.current.switch$.next("");
  }
  readerSectionOpen($event: any) {
    if (window.innerWidth <= 480) {
      this.close();
      this.readerSection.open_bottom_sheet();
      return
    }
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = x - (280 / 2) + (width / 2);
    y = (window.innerHeight) - (y - (height / 4));

    this.readerSection.open({ x, y })
  }
  openSettings() {
    // // readerSettings.open_bottom_sheet({});
    // if(window.innerWidth<=960){
    //   this.close();
    //   this.readerSettings.open_bottom_sheet();
    //   return
    // }
    // let { x, y, width, height } = $event.target.getBoundingClientRect();
    // x = x - (540 / 2) + (width / 2);
    // y = (window.innerHeight) - (y - (height / 4));
    // this.readerSettings.open({
    //   position: {
    //     bottom: `${y}px`,
    //     left: `${x}px`
    //   },
    //   delayFocusTrap: false,
    //   panelClass: "reader_settings_buttom",
    //   backdropClass: "reader_settings_buttom_backdrop",
    // })
  }
}
