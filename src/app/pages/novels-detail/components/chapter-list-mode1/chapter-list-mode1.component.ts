import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AppDataService, ContextMenuEventService, DbComicsControllerService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
import { DropDownMenuService } from '../drop-down-menu/drop-down-menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';
interface Item {
  id: string | number,
  cover: string,
  title: string,
  short_title?: string,
  pub_time?: string | Date | number,
  read?: number,
  ord?: number,
  selected?: boolean,
  like_count?: number | string,
  comments?: number | string,
  is_locked?: boolean
}
@Component({
  selector: 'app-chapter-list-mode1',
  templateUrl: './chapter-list-mode1.component.html',
  styleUrls: ['./chapter-list-mode1.component.scss']
})
export class ChapterListMode1Component {
  // abbreviated list
  _ctrl = false;

  pattern = ''
  is_locked = true;

  selected_length = 0;
  is_all = false;

  constructor(public data: DataService,
    public router: Router,
    public current: CurrentService,
    public ContextMenuEvent: ContextMenuEventService,
    public DbComicsController: DbComicsControllerService,
    public DropDownMenu: DropDownMenuService,
    private _snackBar: MatSnackBar,
    public AppData: AppDataService
  ) {


    if (this.data.chapters[0].title) this.pattern = 'title';
    else this.pattern = 'index';


    if (!this.data.is_locked) this.is_locked = false;
    if (this.data.chapters[0].is_locked === undefined) this.is_locked = false;

    // data.chapters=JSON.parse(JSON.stringify(data.chapters))
  }
  updateComicsItem(x) {

  }
  async all() {
    const c = this.data.chapters.filter(x => x.selected == true).length

    if (c == this.data.chapters.length) {
      this.data.chapters.forEach(x => {
        x.selected = false
      })
    } else {
      this.data.chapters.forEach(x => {
        x.selected = true
      })
    }
    this.getIsAll();
  }

  async getIsAll() {
    const c = this.data.chapters.filter(x => x.selected == true).length
    this.selected_length = c;

    if (c == this.data.chapters.length) {
      this.is_all = true;
    } else {
      this.is_all = false;
    }


  }
  closeEdit() {
    this.data.is_edit = false;
  }
  on($event: MouseEvent) {
    const node = $event.target as HTMLElement;
    if (node.getAttribute("type") == 'list') {

    } else {
      const getTargetNode = (node: HTMLElement): HTMLElement => {
        if (node.getAttribute("region") == "novels_chapters_item") {
          return node
        } else {
          return getTargetNode(node.parentNode as HTMLElement)
        }
      }
      const target_node = getTargetNode(node);
      const index = parseInt(target_node.getAttribute("index") as string);
      if (this.data.is_edit || this._ctrl) {
        this.data.chapters[index].selected = !this.data.chapters[index].selected;
      } else {
        if (this.data.is_locked) {
          this.current.routerReader(this.data.comics_id, this.data.chapters[index].id)
        } else {
          if (this.data.chapters[index].is_locked) {

            this.current.routerReader(this.data.comics_id, this.data.chapters[index].id)
          } else {
            this.current.routerReader(this.data.comics_id, this.data.chapters[index].id)
          }
        }
      }

    }
    this.getIsAll();
  }
  download() {
    const node = document.getElementById("download123");
    let { x, y, width, height } = node!.getBoundingClientRect();
    x = window.innerWidth - 300;
    y = window.innerHeight;
  }


  close() {
    if (this.data.is_edit) return
    if (this._ctrl) return
    this.data.chapters.forEach(x => x.selected = false)
  }

  scrollNode() {
    const node = document.getElementById(`${this.data.chapter_id}`)
    if (node) {
      node!.scrollIntoView({ behavior: 'instant', block: 'center' })
      node?.focus()
    } else {
      setTimeout(() => {
        this.scrollNode()
      }, 33)
    }

  }
  ngAfterViewInit() {
    this.scrollNode();
    // const warp = document.querySelector(".detail_section")
    // warp.setAttribute('hide', 'false')


    // warp.setAttribute('hide', 'false')
  }
}
