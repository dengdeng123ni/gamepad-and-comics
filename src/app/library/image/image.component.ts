import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ImageService, MessageFetchService } from 'src/app/library/public-api';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input() src: string = "";
  @Input() width: string | number | null = "";
  @Input() height: string | number | null = "";
  @Input() alt: string | number | null = "";
  url: SafeUrl | undefined
  @ViewChild('box')
  box!: ElementRef;
  @Input() objectFit: string = ""
  constructor(public image: ImageService) {
    // console.log(this.src);



  }

  isInViewPort(element) {
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const { top, right, bottom, left } = element.getBoundingClientRect();

    return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
  }
  async getImage(str: string) {
    this.url = await this.image.getImageToLocalUrl(this.src)
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getImage(this.src)
    })
  }
  ngOnDestroy() {


    // this.image.delBlobUrl(this.src,this.url as any);
  }
}
