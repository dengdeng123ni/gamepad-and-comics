import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { ChaptersListService } from './chapters-list.service';

@Component({
  selector: 'app-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrl: './chapters-list.component.scss'
})
export class ChaptersListComponent {


  constructor(public data:DataService,
    public current:CurrentService,
    public ChaptersList:ChaptersListService

  ){

  }

  on(e){
  this.current._chapterChange(e)
  this.ChaptersList.close()
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
