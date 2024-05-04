import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class KeyboardEventService {
  public areaEvents: Record<string, { [key: string]: Function }> = {};
  public areaEventsY: Record<string, { [key: string]: Function }> = {};
  public globalEvents: { [key: string]: Function } = {};
  public globalEventsY: { [key: string]: Function } = {};
  constructor(
  ) {



  }

  // Register Y, area event as the first trigger
  registerAreaEventY(key: string, events: { [key: string]: Function }): void {
    if (this.areaEventsY[key]) this.areaEventsY[key] = { ...this.areaEventsY[key], ...events };
    else this.areaEventsY[key] = events;
  }

  // Register area event as the second trigger
  registerAreaEvent(key: string, events: { [key: string]: Function }): void {
    if (this.areaEvents[key]) this.areaEvents[key] = { ...this.areaEvents[key], ...events };
    else this.areaEvents[key] = events;
  }

  // Register Y, global event as the third trigger
  registerGlobalEventY(events: { [key: string]: Function }): void {
    this.globalEventsY = { ...this.globalEventsY, ...events };
  }

  // Register global event as the fourth trigger
  registerGlobalEvent(events: { [key: string]: Function }): void {
    this.globalEvents = { ...this.globalEvents, ...events };
  }
}
