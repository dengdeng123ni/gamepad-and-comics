import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {

  @HostListener('window:keydown', ['$event'])
    handleKeyDown=(event: KeyboardEvent)=> {
      if (event.key == "Enter") this.data.save(this.data.value);

      // return
    }
    constructor(
      @Inject(MAT_DIALOG_DATA) public data,
    ) {

    }
}
