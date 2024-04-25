import { Component } from '@angular/core';
import { DbControllerService } from 'src/app/library/public-api';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-comics-search',
  templateUrl: './comics-search.component.html',
  styleUrl: './comics-search.component.scss'
})
export class ComicsSearchComponent {
   constructor(public DbController: DbControllerService,public data:DataService){
   }


   async init(){

   }
   utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }


}
