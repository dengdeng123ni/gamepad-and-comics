import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrl: './chapters-list.component.scss'
})
export class ChaptersListComponent {


  constructor(public data:DataService){

  }

  on(e){

  }
  scrollNode() {
    const node = document.getElementById(`${this.data.chapter_id}`)


    if (node) {
      console.log(node);
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
