import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ContextMenuEventService, GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { ZipService } from '../../services/zip.service';

const KEY = "comics_item";
@Component({
  selector: 'app-list-mode1',
  templateUrl: './list-mode1.component.html',
  styleUrls: ['./list-mode1.component.scss']
})
export class ListMode1Component {
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
  _ctrl = false;
  selectedList = [];
  edit$ = null;
  constructor(
    public current: CurrentListService,
    public ContextMenuEvent: ContextMenuEventService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public zip: ZipService,
    public config: ConfigListService,
    public i18n: I18nService,
    public router: Router
  ) {
    GamepadEvent.registerAreaEvent("list_toolabr_item", {
      B: () => {
        this.closeEdit();
      }
    })
    GamepadEvent.registerAreaEvent("list_mode_item", {
      B: () => {
      if(config.edit)  this.closeEdit();
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
        setTimeout(()=>{
          GamepadController.setCurrentTargetId('select_all')
        })
      } else {
        this.close();
      }
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

  }
  ngAfterViewInit() {
    const node = document.querySelector("#list");
    node.scrollTop = this.config.view.scrollTop;
  }

  ngOnDestroy() {
    this.edit$.unsubscribe();
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
