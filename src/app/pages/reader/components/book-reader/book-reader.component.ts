import { Component } from '@angular/core';
import { ImageService, GamepadEventService, GamepadControllerService, GamepadInputService, KeyboardEventService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ZoomService } from '../../services/zoom.service';

@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrl: './book-reader.component.scss'
})
export class BookReaderComponent {
  bool=false;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public image: ImageService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public GamepadInput: GamepadInputService,
    public KeyboardEvent: KeyboardEventService,
    public zoom: ZoomService

  ) {
    this.init();
  }

  async init() {


    let arr = this.data.pages.map(x => x.src)
    let blobUrl = [];
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      const blob = await this.image.getImageBlob(element)
      const url = URL.createObjectURL(blob)
      blobUrl.push(url)
    }
    // window./
    (window as any)._gh_page_data = blobUrl.reverse();
    const url = document.querySelector("base").href + 'assets/js/book-component.es.js';
    var script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    document.body.appendChild(script);

     this.bool=true;
  }
}
