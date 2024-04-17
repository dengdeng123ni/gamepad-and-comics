import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  opened = false;
  constructor(public data: DataService) { }
  open() {
    if (!this.opened) this.opened = true;
  }
  isToggle() {
    this.opened = !this.opened;
  }
  close() {
    if (this.opened) this.opened = false;
  }
}
