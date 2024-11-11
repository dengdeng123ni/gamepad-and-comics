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
      if (document.activeElement.tagName == "INPUT") {
        this.auto();
      } else {
        this.whenInputting.close();
      }
    }, 1000)

  }

  on() {
    this.whenInputting.close();
  }

}
