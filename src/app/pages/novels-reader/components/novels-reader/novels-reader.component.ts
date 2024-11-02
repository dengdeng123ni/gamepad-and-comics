import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-novels-reader',
  templateUrl: './novels-reader.component.html',
  styleUrl: './novels-reader.component.scss'
})
export class NovelsReaderComponent {

  list=[];
  constructor(
    public data:DataService,
    public current:CurrentService
  ) {
    console.log(123);

    console.log(this.data,this.current);
     this.init();
  }


  async init(){
    const obj=this.data.chapters[0];
    const id=obj.id;
    const pages= await this.current._getChapter(id);
    this.list.push({
      ...obj,

      pages:pages
    })
    console.log(this.list);

  }
}
