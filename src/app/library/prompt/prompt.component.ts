import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrl: './prompt.component.scss'
})
export class PromptComponent {
  @HostListener('window:keydown', ['$event'])
  handleKeyDown=(event: KeyboardEvent)=> {
    if (event.key == "Enter") this.data.save(this.data.value);

    // return
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
  ) {

  }

  ok() {

  }
  close() {

  }
}
