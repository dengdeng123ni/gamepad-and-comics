import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

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
  ) {
    this.info = this.data.details;
    this.init();
  }
  async init() {

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
}
