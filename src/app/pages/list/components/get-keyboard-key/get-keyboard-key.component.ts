import { Component, HostListener } from '@angular/core';
import { GetKeyboardKeyService } from './get-keyboard-key.service';

@Component({
  selector: 'app-get-keyboard-key',
  templateUrl: './get-keyboard-key.component.html',
  styleUrl: './get-keyboard-key.component.scss'
})
export class GetKeyboardKeyComponent {
  num=3;
  constructor(public GetKeyboardKey:GetKeyboardKeyService){
    setTimeout(()=>{
      this.num--
    },1000)
    setTimeout(()=>{
      this.num--
    },2000)
    setTimeout(()=>{
      this.num--
    },3000)
  }
}
