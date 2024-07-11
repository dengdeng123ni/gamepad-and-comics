import { Injectable } from '@angular/core';
import { GamepadControllerService } from './public-api';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  constructor(public GamepadController:GamepadControllerService) {
  }


  async setNextFocus() {
    if (document.hasFocus) {
      const activeElement = document.activeElement
      const nodes=await this.GamepadController.getNodes2();
      if(!nodes.length) return
      for (let index = 0; index < nodes.length; index++) {
        const x = nodes[index];
        if (activeElement == x) {
          const node=nodes[index + 1];
          if(node){
            (node as any).focus();
            return
          }
        }
      }
      (nodes[0] as any).focus();
    }
  }
  async setPreviousFocus(){
    if (document.hasFocus) {
      const activeElement = document.activeElement
      const nodes=await this.GamepadController.getNodes2();
      if(!nodes.length) return
      for (let index = 0; index < nodes.length; index++) {
        const x = nodes[index];
        if (activeElement == x) {
          const node=nodes[index - 1];
          if(node){
            (node as any).focus();
            return
          }
        }
      }
      (nodes[0] as any).focus();
    }
  }

  async setPrevious_5(){
    for (let index = 0; index < 5; index++) {
      await this.setPreviousFocus();
    }
  }

  async setPrevious_first(){
    const activeElement = document.activeElement
    const nodes=await this.GamepadController.getNodes2();

    (nodes[0] as any).focus();
  }


}
