import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationEventService {
  //
  public Events: { [key: string]: any } = {};
  constructor() {




  }
  register(option: {
    id: string,
    name: string,
    type: '',
    event: Function
  }) {

  }
}
