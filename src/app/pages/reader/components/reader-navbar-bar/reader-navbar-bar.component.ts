import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { bufferCount, Subject, throttleTime } from 'rxjs';
import { GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';
import { ReaderSectionService } from '../reader-section/reader-section.service';
import { ReaderSettingsService } from '../reader-settings/reader-settings.service';
import { ReaderNavbarBarService } from './reader-navbar-bar.service';

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
    return this.current.comics.chapter.index
  }


  change$ = new Subject<number>();
  readerNavbarBarChange$ =null;

  constructor(
    public readerNavbarBar: ReaderNavbarBarService,
    public current: CurrentReaderService,
    public router: Router,
    public readerSettings: ReaderSettingsService,
    public readerSection: ReaderSectionService,
    public GamepadEvent: GamepadEventService,
    public GamepadController:GamepadControllerService,
    public i18n:I18nService

  ) {
    GamepadEvent.registerAreaEvent("reader_navbar_bar_top_item", {
      "B": () => this.close(),
      RIGHT_ANALOG_PRESS: () => {
        this.readerNavbarBar.isToggle();
      },
    })
    GamepadEvent.registerAreaEvent("reader_navbar_bar_buttom_item", {
      "B": () => this.close(),
      LEFT_BUMPER:()=>{
         this.index--;
      },
      RIGHT_BUMPER:()=>{
        this.index++;
      },
      LEFT_TRIGGER:()=>{
        this.index=0;
      },
      RIGHT_TRIGGER:()=>{
        this.index=current.comics.chapter.total-1;
      },
      RIGHT_ANALOG_PRESS: () => {
        this.readerNavbarBar.isToggle();
      },
    })
    this.readerNavbarBarChange$=this.readerNavbarBar.change().subscribe(x => {
      if (x == true) {
        this.opened = true;
        this.zIndex = 500;
      } else {
        this.opened = false;
        setTimeout(() => {
          if (!this.opened)
          {
            this.zIndex = -1;
            this.GamepadController.device("DOWN")
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
    if (e == this.current.comics.chapter.total) e--
    this.current.pageChange(e)
  }
  routerList() {
    this.router.navigate(['/']);
  }
  routerDetail() {
    this.router.navigate(['/detail', this.current.comics.id]);
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
  readerSectionOpen($event) {
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = x - (280 / 2) + (width / 2);
    y = (window.innerHeight) - (y - (height / 4));

    this.readerSection.open({ x, y })
  }
  openSettings($event) {
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = x - (436 / 2) + (width / 2);
    y = (window.innerHeight) - (y - (height / 4));
    this.readerSettings.open({
      position: {
        bottom: `${y}px`,
        left: `${x}px`
      },
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop",
    })
  }
}
