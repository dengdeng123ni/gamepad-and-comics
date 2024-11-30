import { Component } from '@angular/core';
import { WhenInputtingService } from './when-inputting.service';

@Component({
  selector: 'app-when-inputting',
  templateUrl: './when-inputting.component.html',
  styleUrl: './when-inputting.component.scss'
})
export class WhenInputtingComponent {

  constructor(public whenInputting: WhenInputtingService) {
    this.auto();
  }

  auto() {
    setTimeout(() => {
      const list=["INPUT","TEXTAREA"]
      if (list.includes(document.activeElement.tagName)) {
        this.auto();
      } else {
        this.whenInputting.close();
      }
    }, 600)

  }

  on() {
   setTimeout(()=>{
    this.whenInputting.close();
   },500)
  }

}
