import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { DbComicsEventService } from 'src/app/library/public-api';
import { RoutingControllerService } from 'src/app/library/routing-controller.service';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ReaderConfigService } from '../reader-config/reader-config.service';
import { ReaderNavbarBarService } from '../reader-navbar-bar/reader-navbar-bar.service';
import { ReaderSectionService } from '../reader-section/reader-section.service';

@Component({
  selector: 'app-reader-navbar-bar-v2',
  templateUrl: './reader-navbar-bar-v2.component.html',
  styleUrl: './reader-navbar-bar-v2.component.scss'
})
export class ReaderNavbarBarV2Component {
  opened = false;
  zIndex = 11;

  @HostListener('window:resize', ['$event'])
  resize = (event: KeyboardEvent) => {


    document.documentElement.style.setProperty('--reader-navbar-bar-zoom', `${((window.innerHeight*0.1)/90)>1?((window.innerHeight*0.1)/90):1}`);
  }

  public set index(v: number) {
    this.change$.next(v)
  }
  public get index() {
    return this.data.page_index+1
  }

  title='首页';

  change$ = new Subject<number>();
  readerNavbarBarChange$;
  chapter_index = 0;
  constructor(
    public readerNavbarBar: ReaderNavbarBarService,
    public ReaderConfig:ReaderConfigService,
    public current: CurrentService,
    public router: Router,
    public data: DataService,
    public readerSection: ReaderSectionService,
    public DbComicsEvent:DbComicsEventService,
    public RoutingController:RoutingControllerService
  ) {
    document.documentElement.style.setProperty('--reader-navbar-bar-zoom', `${((window.innerHeight*0.1)/90)>1?((window.innerHeight*0.1)/90):1}`);
    this.title= DbComicsEvent.Configs[current.source]?.name;
    this.readerNavbarBarChange$ = this.readerNavbarBar.change().subscribe(x => {
      if (x == true) {
        this.chapter_index = data.chapters.findIndex(x => x.id == data.chapter_id)
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

    this.change$.pipe(debounceTime(100)).subscribe(x => {
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
    this.RoutingController.navigate('list')
  }
  routerDetail() {
    this.router.navigate(['/detail',this.current.source, this.data.comics_id]);
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
    if (window.innerWidth <= 480) {
      this.close();
      this.ReaderConfig.open_bottom_sheet()
      return
    }
    this.ReaderConfig.open()
  }
}
