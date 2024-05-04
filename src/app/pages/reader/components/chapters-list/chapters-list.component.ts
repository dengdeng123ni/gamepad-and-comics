import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ContextMenuEventService } from 'src/app/library/public-api';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
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
  selector: 'app-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrls: ['./chapters-list.component.scss']
})
export class ChaptersListComponent {
  _ctrl = false;
  constructor(public data: DataService,
    public router: Router,
    public current: CurrentService, public doublePageThumbnail: DoublePageThumbnailService, public ContextMenuEvent: ContextMenuEventService,) {

  }
  on($event: MouseEvent) {
    const node = $event.target as HTMLElement;
    if (node.getAttribute("id") == 'list') {

    } else {
      const getTargetNode = (node: HTMLElement): HTMLElement => {
        if (node.getAttribute("region") == "chapter_item") {
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
          // this.router.navigate(['/', this.data.comics_id, this.data.chapters[index].id,])
        } else {
          if (this.data.chapters[index].is_locked) {

          } else {
            // this.router.navigate(['/', this.data.comics_id, this.data.chapters[index].id,])
          }
        }
      }

    }
  }
  close() {
    if (this.data.is_edit) return
    if (this._ctrl) return
    this.data.chapters.forEach(x => x.selected = false)
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const node = document.getElementById(`${this.data.chapter_id}`)
      node!.scrollIntoView({ behavior: 'instant', block: 'center' })
      node?.focus()
    },100)
  }

}
