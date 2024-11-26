import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent {

  @Input() list: Array<any> = [];
  @Input() change: Function;



  on(){
    let obj={};
    console.log(this.list);

    for (let index = 0; index < this.list.length; index++) {
       const c= this.list[index]
      if(c.value) obj[c.id]=c.value
    }
    this.change(obj)


  }
}
