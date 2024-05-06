import { Component, Input } from '@angular/core';
import { ImageService, PagesItem } from 'src/app/library/public-api';

@Component({
  selector: 'app-canvas-image1',
  templateUrl: './canvas-image1.component.html',
  styleUrls: ['./canvas-image1.component.scss']
})
export class CanvasImage1Component {
  @Input() index: number = 0;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() list: Array<PagesItem> = [];
  constructor(private image: ImageService) {


  }

  async init() {

    const start_height = this.index * this.height;
    const end_height = (this.index + 1) * this.height;
    let current_heigth = 0;
    for (let index = 0; index < this.list.length; index++) {
      this.list[index].height = (this.list[index].height / this.list[index].width) * this.width;
      this.list[index].width = this.width;
      current_heigth = current_heigth + this.list[index].height;
      const h = current_heigth - start_height;

      if (h > -1) {
        const image1 = await createImageBitmap(await this.image.getImageBlob(this.list[this.index].src))
        let canvas = document.querySelector(`#canvas_${this.index}`) as any;
        canvas.width = this.width;
        canvas.height = this.height;
        let context = canvas.getContext('2d');
        context.rect(0, 0, canvas.width, canvas.height);
        const bb = () => {
          if(this.index==0) return 0
          const start_heightc = (this.index - 1) * this.height;
          const end_heightc = (this.index) * this.height;
          const h2 = end_heightc - (start_heightc + this.list[index - 1].height);
          console.log(h2);
          return h2
        }
        const h3=bb();
        context.drawImage(image1, 0, -h3, canvas.width, this.list[index].height);
        const h2 = end_height - (start_height + this.list[index].height);
        // console.log(this.index,index,h2);
        if (h2 > 0) {
          const image2 = await createImageBitmap(await this.image.getImageBlob(this.list[this.index + 1].src))
          context.drawImage(image2, 0, this.height - h2, canvas.width, this.list[index].height);
        }
        return
      }
    }

  }
  ngAfterViewInit() {
    this.init()
  }
}
