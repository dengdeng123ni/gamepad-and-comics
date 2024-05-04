import { Injectable } from '@angular/core';
import { WindowEventService } from './window-event.service';

@Injectable({
  providedIn: 'root'
})
export class WindowControllerService {
  getTarget = (node: HTMLElement): { key: string,node:HTMLElement,value: string } => {
    const region = node.getAttribute("region");
    const section = node.getAttribute("section");
    if (section) {
      return { key: "section",node:node, value: section }
    }
    if (region) {
      return { key: "region",node:node, value: region }
    } else {
      return this.getTarget(node.parentNode as HTMLElement);
    }
  }
  constructor(public WindowEvent:WindowEventService) {
    window.addEventListener('click', (e: any) => {
      const { key,node, value } = this.getTarget(e.target as HTMLElement);
      if (key == "region") {
        e.node=node;
        this.WindowEvent.clickRegionEvents[value](e);
      }
      if (key == "section") {
        e.node=node;
        this.WindowEvent.clickSectionEvents[value](e);
      }
    })


    // window.addEventListener('mousemove', (e: any) => {


    // })

    // focus

  }
}
