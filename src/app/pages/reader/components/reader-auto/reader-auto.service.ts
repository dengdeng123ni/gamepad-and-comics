import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReaderAutoService {

  opened =false;
  constructor(
    ) {

  }
  open() {
    this.opened=true;
  }
  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }
  close() {
    this.opened=false;
  }

}
