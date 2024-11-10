import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-comics-offprint-detail',
  templateUrl: './comics-offprint-detail.component.html',
  styleUrls: ['./comics-offprint-detail.component.scss']
})
export class ComicsOffprintDetailComponent {
  info = null;

  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public image: ImageService,
  ) {
    this.info = this.data.details;
    this.init();
  }
  async init() {
    const { width, height } = await this.getCoverImageHW(this.info.cover)
    this.info.width = width;
    this.info.height = height;
  }
  on(e){
    window.open(e,'_blank')
  }
  back() {
    this.router.navigate(['/'])
  }
  continue() {
    this.router.navigate(['/', this.data.comics_id, this.data.chapter_id,])
  }


  async getCoverImageHW(src) {
    const utf8_to_b64 = (str: string) => {
      return window.btoa(encodeURIComponent(str));
    }
    const id = utf8_to_b64(src);
    const res = await this.current._getImageHW(id)

    if (res) {
      return { width: res.width, height: res.height }
    } else {
      const url = await this.image.getImageToLocalUrl(src);
      const loadImage = async (url: string) => {
        return await  await createImageBitmap(await fetch(url).then((r) => r.blob()))
      }
      const img = await loadImage(url.changingThisBreaksApplicationSecurity);
      this.current._setImageHW(id, { width: img.width, height: img.height })
      return { width: img.width, height: img.height }
    }

  }
}
