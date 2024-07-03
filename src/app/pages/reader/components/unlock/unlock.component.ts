import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { UnlockService } from '../../services/unlock.service';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.component.html',
  styleUrl: './unlock.component.scss'
})
export class UnlockComponent {
  constructor( public current: CurrentService,public unlock:UnlockService){

  }
  close() {
    this.unlock.close();
  }
  async on() {
    await this.current._unlock(this.unlock.chapter_id);
    this.unlock.close();
  }
}
