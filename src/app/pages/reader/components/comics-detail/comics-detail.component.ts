import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ComicsDetailService } from './comics-detail.service';

@Component({
  selector: 'app-comics-detail',
  templateUrl: './comics-detail.component.html',
  styleUrl: './comics-detail.component.scss'
})
export class ComicsDetailComponent {
  info = null;

  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public image: ImageService,
    public ComicsDetail: ComicsDetailService
  ) {
    this.info = this.data.details;
    this.init();
  }
  async init() {

  }
  on2(e) {
    window.open(e, '_blank')
  }
  on(e) {
    if (e.router) {
      this.router.navigate(['/query', 'advanced_search', 'ehentai', e.router[0]], {
        queryParams: {
          _gh_condition: window.btoa(encodeURIComponent(JSON.stringify(e.router[1]))),
        }
      });
    } else {
      if (e.href) window.open(e.href, '_blank')
    }
    this.ComicsDetail.close();
  }
  back() {
    this.router.navigate(['/'])
  }
  continue() {
    this.router.navigate(['/', this.data.comics_id, this.data.chapter_id,])
  }
}
