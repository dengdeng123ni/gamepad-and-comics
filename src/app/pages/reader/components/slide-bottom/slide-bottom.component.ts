import { Component, OnInit } from '@angular/core';
import { CurrentReaderService } from '../../services/current.service';
import { SlideBottomService } from './slide-bottom.service';

@Component({
  selector: 'app-slide-bottom',
  templateUrl: './slide-bottom.component.html',
  styleUrls: ['./slide-bottom.component.scss']
})
export class SlideBottomComponent implements OnInit {



  old_index = -1;

  list = [];
  chapter_index = -1;

  constructor(
    public current: CurrentReaderService,
    public SlideBottom:SlideBottomService
  ) {
    ({ index:this.chapter_index } = this.current.comics.chapter);
    this.list = this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id).images;
  }
  change(index) {
    if (index||index===0) {
      let container = document.querySelector("#thumbnail_sidebar_bottom") as any;
      let node = document.querySelector(`[_id=thumbnail_sidebar_bottom_${index}]`);
      if(this.old_index == index) return
      let observer = new IntersectionObserver(
        changes => {
          changes.forEach(x => {
            if (x.intersectionRatio != 1) {
              node.scrollIntoView({block: "center", inline: "center"})
              container.classList.remove("opacity-0");
              this.old_index = index; }
            observer.unobserve(node);
          });
        }
      );
      observer.observe(node);
    }
  }

  ngOnDestroy() {
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
