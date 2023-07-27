import { Component } from '@angular/core';
import { BilibiliDetailService } from '../../page/bilibili-detail/bilibili-detail.service';
import { I18nService } from 'src/app/library/public-api';

@Component({
  selector: 'app-bilibili-info',
  templateUrl: './bilibili-info.component.html',
  styleUrls: ['./bilibili-info.component.scss']
})
export class BilibiliInfoComponent {
  comics:any = {
    cover:{
      src:""
    },
    title:"",
    chapter:{
      title:""
    },
    chapters:[{}]
  };
  constructor(public i18n:I18nService,
    public BilibiliDetail:BilibiliDetailService){

  }
  continue(e){

  }
  back(){

  }
}
