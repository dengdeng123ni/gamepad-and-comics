import { Component, ElementRef, OnInit } from '@angular/core';
import { CurrentReaderService } from '../../services/current.service';
import { SidebarLeftService } from './sidebar-left.service';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})
export class SidebarLeftComponent implements OnInit {
  old_index = -1;
  page$=null;
  list = [];
  chapter_index = -1;

  constructor(
    public current: CurrentReaderService,
    public left: SidebarLeftService,
  ) {
    ({ index:this.chapter_index } = this.current.comics.chapter);
    this.list = this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id).images;
    this.page$=this.current.page().subscribe(x=> this.change(x));
  }
  change(index) {
    this.chapter_index=index;
    let container = document.querySelector("#thumbnail_sidebar_left") as any;
    let node = document.querySelector(`[_id=thumbnail_sidebar_left_${index}]`);
    if (this.old_index == index) return
    let observer = new IntersectionObserver(
      changes => {
        changes.forEach(x => {
          if (x.intersectionRatio != 1) {
            node.scrollIntoView({block: "center", inline: "center"})
            this.old_index = index;
          }
          container.classList.remove("opacity-0");
          observer.unobserve(node);
        });
      }
    );
    observer.observe(node);
  }

  ngOnDestroy() {
    this.page$.unsubscribe();
    this.left.close();
  }
  ngOnInit(): void {

  }

  ngAfterViewInit(){
    this.change(this.chapter_index)
  }

  on(index: number) {
    this.chapter_index=index;
    this.current.pageChange(index)
  }
}
