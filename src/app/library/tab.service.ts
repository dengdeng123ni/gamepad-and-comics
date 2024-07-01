import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  constructor() {
  }


  setNextFocus() {
    if (document.hasFocus) {
      const activeElement = document.activeElement
      const nodes = document.querySelectorAll("[region]");
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
  setPreviousFocus(){
    if (document.hasFocus) {
      const activeElement = document.activeElement
      const nodes = document.querySelectorAll("[region]");
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


}
