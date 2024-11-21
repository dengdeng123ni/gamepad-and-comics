import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamsEventService {
  //
  public params_types: { [key: string]: Function } = {};

  public params: { [key: string]: Function } = {};

  constructor() {

  }


  _register_params_key_type(key, event) {
    this.params_types[key] = event;
  }
  _register_params(key, event) {
    this.params[key] = event;
  }
}
