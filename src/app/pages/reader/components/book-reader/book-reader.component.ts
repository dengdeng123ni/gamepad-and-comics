import { Component } from '@angular/core';
import { ImageService, GamepadEventService, GamepadControllerService, GamepadInputService, KeyboardEventService, RoutingControllerService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ZoomService } from '../../services/zoom.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrl: './book-reader.component.scss'
})
export class BookReaderComponent {
  bool = false;
  page_index=0;
  page_max_index=0;
  constructor(
    public current: CurrentService,
    public RoutingController: RoutingControllerService,
    public data: DataService,
    public image: ImageService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public GamepadInput: GamepadInputService,
    public KeyboardEvent: KeyboardEventService,
    public zoom: ZoomService

  ) {
    GamepadEvent.registerAreaEvent('page_reader', {
      "LEFT": () => {
        this.zoom.zoomSize <= 1 ? this.current._pageNext() : this.zoom.down("DPAD_LEFT");
      },
      "UP": () => {
        this.zoom.zoomSize <= 1 ? this.current._pagePrevious() : this.zoom.down("DPAD_UP");
      },
      "DOWN": () => {
        this.zoom.zoomSize <= 1 ? this.current._pageNext() : this.zoom.down("DPAD_DOWN");
      },
      "RIGHT": () => {
        this.zoom.zoomSize <= 1 ? this.current._pagePrevious() : this.zoom.down("DPAD_RIGHT");
      },
      "X": () => {
        // this.pageToggle();
      },
      "A": () => {
        this.current._pageNext();
      },
      "LEFT_BUMPER": () => this.zoom.zoomOut(),
      "RIGHT_BUMPER": () => {
        this.zoom.zoomIn()
      },
      LEFT_TRIGGER: () => {
        current._chapterPrevious();
      },
      RIGHT_TRIGGER: () => {
        current._chapterNext();
      },

    })
    this.current.change().subscribe(async (x) => {

      if (x.trigger == 'double_page_reader_v2') return
      if (x.type == "changePage") {

      } else if (x.type == "changeChapter") {
        await this.current._setChapterIndex(x.chapter_id, 0)
        await this.RoutingController.routerReader(current.source, data.comics_id)
        setTimeout(() => {
          window.location.replace(window.location.href);
        }, 100)
        this.current._loadPages(x.chapter_id)
      } else if (x.type == "nextPage") {
        this.page_index=this.page_index-1;
        if(this.page_index==-1){
          const id= await this.current._getNextChapterId();
          if(id){
            this.current._change('changeChapter',{
              page_index:0,
              chapter_id:id
            })
          }

        }else{
          (window as any)._gh_book_reader_setPage(this.page_index)
        }


      } else if (x.type == "previousPage") {
        this.page_index=this.page_index+1;
        console.log(this.page_index,this.page_max_index);

        if(this.page_index>this.page_max_index){
          const id= await this.current._getPreviousChapterId();
          console.log(id);

          if(id){
            this.current._change('changeChapter',{
              page_index:0,
              chapter_id:id
            })
          }
        }else{
          (window as any)._gh_book_reader_setPage(this.page_index)
        }

      }
    })
    this.init();
  }

  async init() {

    //
    if(document.querySelector("#book-component")){
      window.location.replace(window.location.href);
    }

    let arr = this.data.pages.map(x => x.src)
    let blobUrl = [];
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      const blob = await this.image.getImageBlob(element)
      const url = URL.createObjectURL(blob)
      blobUrl.push(url)
    }
    if (blobUrl.length % 2 !== 0) {
      const createWhiteImage = (width, height) => {
        return new Promise((r, j) => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          // 填充白色
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);

          // 转换为 Blob
          canvas.toBlob((blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              r(blobUrl);
            }
          }, "image/png");
        });
      }
      const src=blobUrl[blobUrl.length-1]
      const image= await createImageBitmap(await (await fetch(src)).blob());
      const url=await createWhiteImage(image.width,image.height)
      blobUrl.push(url)

    }
    (window as any)._gh_page_data = blobUrl.reverse();
    const url = document.querySelector("base").href + 'assets/js/book-component.es.js';
    await fetch(url)
    var script = document.createElement('script');
    script.setAttribute('id','book-component');
    script.type = 'module';
    script.src = url;

    document.body.appendChild(script);
    this.bool = true;
    this.page_index= blobUrl.length / 2;
    this.page_max_index= blobUrl.length/2;

    //
  }
  ngOnDestroy() {
    (window as any)._gh_page_data.forEach(x=>{
      URL.revokeObjectURL(x)
    })
  }

}
