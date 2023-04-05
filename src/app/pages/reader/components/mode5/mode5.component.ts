import { Component, NgZone } from '@angular/core';
import { ContextMenuEventService, GamepadEventService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-mode5',
  templateUrl: './mode5.component.html',
  styleUrls: ['./mode5.component.scss']
})
export class Mode5Component {
  list = [];
  double_list=[];
  chapterId = null;
  index = -1;

  afterInit$ = null;
  chapter$ = null;
  page$ = null;
  switch$ = null;
  nextPage$ = null;
  previousPage$ = null;

  constructor(
    public images: ImagesService,
    public current: CurrentReaderService,
    private zone: NgZone,
    public ContextMenuEvent: ContextMenuEventService,
    public config: ConfigReaderService,
    public GamepadEvent: GamepadEventService,
    public general: GeneralService
  ) {
    this.chapter$ = this.current.chapter().subscribe(async x => {
      const { id, index } = this.current.comics.chapter;
      const { chapters } = this.current.comics;
      const chapter = chapters.find(x => x.id == id);
      const images = chapter.images;
      this.init(id, index);
    })
    this.page$ = this.current.page().subscribe(async (index: number) => {
      this.init(this.chapterId, index);
    })
    this.init(this.current.comics.chapter.id, this.current.comics.chapter.index)
  }
  async init(id, index) {
    this.chapterId = id;
    this.index = index;
    const list = this.current.comics.chapters.find(x => x.id == this.chapterId).images.map(x => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: x.src
    }))

    const double_list = await this.images.getPageDouble(list, { isFirstPageCover: this.current.comics.isFirstPageCover, pageOrder: this.current.comics.pageOrder });
    double_list.forEach(x => {
      x.images.forEach(c => {
        if (!x.select) x.select = (c.index - 1) == index;
      })
    })
    this.zone.run(() => {
      this.double_list = double_list;
      this.complete()
      setTimeout(() => this.complete(), 150)
    })
  }

  ngAfterViewInit() {
    // if(this.list.length){
    //   this.list.forEach(x => {
    //     x.images.forEach(c => {
    //       x.select = (c.index - 1) == this.index;
    //     })
    //   })
    //   setTimeout(()=>{
    //     this.complete()
    //   },50)
    // }
  }
  complete = () => {
    const node = document.querySelector("#mode5 div[select=true]");

    if (node) {
      node.scrollIntoView({ block: "center", inline: "center" });
      (node as any).focus();
      const nodes = document.querySelectorAll(".list img[id]");
      var observer = new IntersectionObserver(
        (changes) => {
          changes.forEach((change: any) => {
            if (change.isIntersecting || change.isVisible) {
              var container = change.target;
              const id = parseInt(container.getAttribute('id'));
              const index = parseInt(container.getAttribute('index'));
              this.start(id, index)
            } else {
              var container = change.target;
              const id = parseInt(container.getAttribute('id'));
              const index = parseInt(container.getAttribute('index'));
              this.end(id, index)
            }
          });
        }
      );
      nodes.forEach(node => observer.observe(node))
      setTimeout(() => {
        document.querySelector("#mode5").classList.remove("opacity-0");
      }, 150)
    } else {
      setTimeout(() => {
        this.complete()
      }, 5)
    }
  }


  close() {
  }

  start(id, index) {
    if(index=="NaN") return
    this.list.push({ id: id, index: index, startTime: new Date().getTime() })
    this.current.comics.chapter.index = index;
    this.current.update_state(this.current.comics.chapter, index);
  }
  end(id, index) {
    const update = (imageId, chapterId, comicsId, startTime, endTime) => {
      this.current.imageReadingTime$.next({ imageId: id, chapterId: chapterId, comicsId: comicsId, startTime: startTime, endTime: endTime })
    }
    const index1 = this.list.findIndex(x => x.id == id)
    if (index1 > -1) {
      let obj = this.list[index1];
      update(obj.id, this.current.comics.chapter.id, this.current.comics.id, obj.startTime, new Date().getTime())
      this.list.splice(index1, 1)
    }
  }

}
