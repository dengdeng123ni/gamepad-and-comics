import { Component, Input, ViewChild } from '@angular/core';
import { AppDataService, ImageService, WorkerService } from 'src/app/library/public-api';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input() src: string = "";
  @Input() source: string = "";
  @Input() width: string | number | null = "";
  @Input() height: string | number | null = "";
  @Input() alt: string | number | null = "";
  url:  string= "";
  @Input() objectFit: string = ""

  is_init_free=false;
  constructor(public image: ImageService,
    public WebWorker: WorkerService,
    public App: AppDataService
  ) {



  }

  async getImage() {
    this.url = await this.image.getImageToLocalUrl(this.src)
  }

  async getImage2() {
    this.url = await this.WebWorker.UrlToBolbUrl(this.src)
  }

  ngAfterViewInit() {
    if(!this.src) {
      this.url=""
    }
    else  if (this.App.is_pwa && this.src.substring(7, 21) == "localhost:7700") {
      this.url = this.src;
    } else {
      if (this.App.is_web_worker && this.src.substring(7, 21) == "localhost:7700") {
        setTimeout(() => {
          this.getImage()
        })
      }else{
        setTimeout(() => {
          this.getImage()
        })
      }
    }
  }
  ngOnDestroy() {


    // this.image.delBlobUrl(this.src,this.url as any);
  }
}
