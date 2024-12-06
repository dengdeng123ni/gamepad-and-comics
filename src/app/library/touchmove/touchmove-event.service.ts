import { Injectable } from '@angular/core';


interface TouchmoveEvents {
  UP?: Function;
  RIGHT?: Function;
  DOWN?: Function;
  LEFT?: Function;
}


@Injectable({
  providedIn: 'root'
})
export class TouchmoveEventService {
  public Events: Record<string, TouchmoveEvents> = {};
  constructor() { }


  register(key: string, events: TouchmoveEvents): void {
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
  }
}
