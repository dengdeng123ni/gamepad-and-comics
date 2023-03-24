import { Component, OnInit } from '@angular/core';
import { CurrentReaderService } from '../../services/current.service';
import { ThumbnailService } from './thumbnail.service';

@Component({
  selector: 'app-thumbnail-list',
  templateUrl: './thumbnail-list.component.html',
  styleUrls: ['./thumbnail-list.component.scss']
})
export class ThumbnailListComponent implements OnInit {


  old_index = -1;
  list = [];
  chapter_index = -1;
  constructor(
    public current: CurrentReaderService,
    public Thumbnail: ThumbnailService
  ) {
    ({ index:this.chapter_index } = this.current.comics.chapter);

    this.list = this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id).images;

    // this.change$ = this.current.change().subscribe((x: number) => this.change(x))
  }
  change(index) {
    if (index || index === 0) {
      let container = document.querySelector("#thumbnail_list") as any;
      let node = document.querySelector(`[_id=thumbnail_list_${index}]`);
      let position = node.getBoundingClientRect();
      if (this.Thumbnail.scrollTop) {
        container.scrollTop = this.Thumbnail.scrollTop;
        this.Thumbnail.scrollTop = 0;
        setTimeout(() => {
          let container = document.querySelector("#thumbnail_list") as any;
          let node = document.querySelector(`[_id=thumbnail_list_${index}]`);
          let position = node.getBoundingClientRect();
          let observer = new IntersectionObserver(
            changes => {
              changes.forEach(x => {
                if (x.intersectionRatio != 1) {
                  node.scrollIntoView({ block: "center", inline: "center" })
                  this.old_index = index;
                }
                container.classList.remove("opacity-0");
                observer.unobserve(node);
              });
            }
          );
          observer.observe(node);
        }, 1000)
        // container.classList.remove("opacity-0");
        return
      }
      if (this.old_index == index) return
      let observer = new IntersectionObserver(
        changes => {
          changes.forEach(x => {
            if (x.intersectionRatio != 1) {
              node.scrollIntoView({ block: "center", inline: "center" })
              container.classList.remove("opacity-0");
              this.old_index = index;
            }
            observer.unobserve(node);
          });
        }
      );
      observer.observe(node);
    }
  }
  scrollTop = 0;
  ngOnDestroy() {
    // this.change$.unsubscribe();
    let container = document.querySelector("#thumbnail_list") as any;
    this.Thumbnail.scrollTop = container.scrollTop;
  }
  ngOnInit(): void {


  }
  ngAfterViewInit() {
    this.change(this.chapter_index)
  }
  on(index: number) {
    this.chapter_index=index;
    this.current.pageChange(index)
  }
}
