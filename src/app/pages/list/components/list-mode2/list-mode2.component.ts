import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContextMenuEventService, GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { ZipService } from '../../services/zip.service';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { DataListService } from '../../services/data.service';
const KEY = "comics_item";
@Component({
  selector: 'app-list-mode2',
  templateUrl: './list-mode2.component.html',
  styleUrls: ['./list-mode2.component.scss']
})
export class ListMode2Component {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "Meta") this._ctrl = true;
    if (event.key == "Control") this._ctrl = true;
    if (event.key == "a") this.selectAll()
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Meta") this._ctrl = false;
    if (event.key == "Control") this._ctrl = false;
  }
  @HostListener('window:resize', ['$event'])
  resize() {
    this.getLists();
  }
  _ctrl = false;
  selectedList = [];
  edit$ = null;

  _keyword = "";
  get keyword() { return this._keyword };
  set keyword(value: string) {
    this.current.search(value);
    this._keyword = value;
  }

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  swiperOptions: SwiperOptions = {
    direction: "vertical",
    mousewheel: {
      thresholdDelta: 50,
      forceToAxis: false,
    },
    scrollbar: { draggable: true },
    pagination: {
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + "</span>";
      },
    },
  };
  activeIndex=0;
  slideChange(swiper) {
    this.activeIndex = swiper[0].activeIndex;
   setTimeout(()=>{
    this.GamepadController.setCurrentTargetId(`_${this.data.lists[this.activeIndex][0].id}`, false)
   })

    // this.activeIndex = swiper[0].activeIndex;
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  initAfter$ = null;
  change$ = null;
  constructor(
    public current: CurrentListService,
    public data:DataListService,
    public ContextMenuEvent: ContextMenuEventService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public zip: ZipService,
    public config: ConfigListService,
    public i18n: I18nService,
    public router: Router,
  ) {
    GamepadEvent.registerAreaEvent("list_toolabr_item", {
      B: () => {
        this.closeEdit();
      }
    })
    GamepadEvent.registerAreaEvent("list_mode_item", {
      LEFT_TRIGGER: () => {
        this.swiper.swiperRef.slidePrev();
      },
      RIGHT_TRIGGER: () => {
        this.swiper.swiperRef.slideNext();
      },
      B: () => {
        if (config.edit) this.closeEdit();
      }
    })
    GamepadEvent.registerHoverEvent(KEY, {
      ENTER: () => {
      },
      LEAVE: () => {
      }
    })
    ContextMenuEvent.register('item', {
      on: e => {
        let selectedList = [];
        if (this.selectedList.length) {
          selectedList = this.selectedList;
        } else {
          const id = parseInt(e.value);
          selectedList = this.current.list.filter(x => x.id == id);
        }
        if (e.id == "delete") {
          selectedList.forEach(x => this.current.delete(x.id))
        } else if (e.id == "github_pages") {
          this.exportZip(selectedList);
        }
      },
      menu: [
        // { name: "Github Pages", id: "github_pages" },
        { name: "delete", id: "delete" },
      ]
    })
    this.edit$ = this.current.edit().subscribe(x => {
      if (x) {
        setTimeout(() => {
          GamepadController.setCurrentTargetId('select_all')
        })
      } else {
        this.close();
      }
    })
    this.initAfter$ = this.current.initAfter().subscribe(() => {
      this.getLists()
    })
    this.change$ = this.current._change().subscribe(() => {
      this.getLists()
    })
  }
  selectedDetele() {
    this.selectedList.forEach(x => this.current.delete(x.id))
  }
  exportZip(selectedList) {
    let arr = [];
    selectedList.forEach(x => {
      x.chapters.forEach(c => {
        c.images.forEach((j, i) => {
          if (x.chapters.length == 1) {
            arr.push({
              path: `${x.title}/${i + 1}`,
              src: j.src
            })
          } else {
            arr.push({
              path: `${x.title}/${c.title}/${i + 1}`,
              src: j.src
            })
          }
        })
      })
    })
    this.zip.images(arr)
  }
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  list_view_config = {
    width: 0,
    height: 0,
    count: 0,
    forCount: 0
  }
  ngAfterViewInit() {
    this.getLists();
  }
  w2 = 0;
  h2 = 0;
  getLists() {
    if (!this.current.list.length) {
      this.data.lists = [];
      return
    }
    let node = document.querySelector("#list") as any;
    let w2 = ((node.clientWidth - 32) / (144 + 1.8 * 16));
    let h2 = (node.clientHeight / (248 + 0.9 * 16 * 2)) + 0.2;
    if (h2 < 1) h2 = 1;
    node.style.height = `${Math.trunc(h2) * (248 + 0.9 * 16 * 2) + 16}px`;
    const count = Math.trunc(h2) * Math.trunc(w2);
    this.w2 = Math.trunc(w2);
    this.h2 = Math.trunc(h2);
    const o = Math.ceil(this.current.list.length / count);
    this.data.lists = [];
    for (let i = 0; i < o; i++) {
      const e = this.current.list.slice(i * count, (i + 1) * count);
      this.data.lists.push(e)
    }
  }
  prev() {
    this.swiper.swiperRef.slidePrev();
  }
  next() {
    this.swiper.swiperRef.slideNext();
  }
  ngOnDestroy() {
    this.edit$.unsubscribe();
    this.initAfter$.unsubscribe();
    this.change$.unsubscribe();
    this.close();
    const node = document.querySelector("#list");
    this.config.view.scrollTop = node.scrollTop;
  }
  closeEdit() {
    this.config.edit = !this.config.edit;
    this.current.edit$.next(this.config.edit);
    setTimeout(() => {
      this.GamepadController.setCurrentTargetId("list_side_edit");
    }, 50)
  }
  ngDoCheck(): void {
    this.selectedList = this.current.list.filter(x => x.selected == true)
  }
  on($event, x) {
    if (this.config.edit) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this.config.edit) return
    if (this._ctrl) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this._ctrl) return
    this.router.navigate(['/detail', x.id])
    this.config.view.id = x.id;
  }
  on_keep_watching($event, x) {
    $event.stopPropagation();
    if (this.config.edit) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this.config.edit) return
    if (this._ctrl) {
      let obj = this.current.list.find(s => s.id == x.id);
      obj.selected = !obj.selected;
    }
    if (this._ctrl) return
    this.current.continue(x.id);
    this.config.view.id = x.id;
  }
  close() {
    if (this.config.edit) return
    if (this._ctrl) return
    this.current.list.forEach(x => x.selected = false)
  }
  selectAll() {
    if (!this._ctrl && !this.config.edit) return
    const bool = this.current.list.filter(x => x.selected == true).length == this.current.list.length;
    if (bool) {
      this.current.list.forEach(x => x.selected = false)
    } else {
      this.current.list.forEach(x => x.selected = true)
    }
  }
}
