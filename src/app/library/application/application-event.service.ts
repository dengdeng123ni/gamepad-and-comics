import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationEventService {
  //
  public Events: { [key: string]: any } = {};
  constructor() {
    const config = {
      id: "gamepad_up",
      name: "手柄按键[上]",
      type: "gamepad",
      event: () => { }
    }




  }
  register(option: {
    id: string,
    name: string,
    type: '',
    event: Function
  }) {

  }
}
