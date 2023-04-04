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
  chapterId = null;
  index = -1;
  constructor(
    public images: ImagesService,
    public current: CurrentReaderService,
    private zone: NgZone,
    public ContextMenuEvent: ContextMenuEventService,
    public config: ConfigReaderService,
    public GamepadEvent: GamepadEventService,
    public general: GeneralService
  ) {
    this.init(this.current.comics.chapter.id,this.current.comics.chapter.index)
  }
  async init(id, index) {
    this.chapterId = id;
    this.index = index;
    const list = this.current.comics.chapters.find(x => x.id == this.chapterId).images.map(x => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: x.small
    }))

    const double_list = await this.images.getPageDouble(list, { isFirstPageCover: this.current.comics.isFirstPageCover, pageOrder: this.current.comics.pageOrder });
    double_list.forEach(x => {
      x.images.forEach(c => {
        if (!x.select) x.select = (c.index - 1) == index;
      })
    })
    this.zone.run(() => {
      this.list = double_list;
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
    const node = document.querySelector("#double_page_thumbnail div[select=true]");

    if (node) {
      node.scrollIntoView({ block: "center", inline: "center" });
      (node as any).focus();
      setTimeout(() => {
        document.querySelector("#double_page_thumbnail").classList.remove("opacity-0");
      }, 150)
    } else {
      setTimeout(() => {
        this.complete()
      }, 5)
    }
  }


  close() {
  }



}
