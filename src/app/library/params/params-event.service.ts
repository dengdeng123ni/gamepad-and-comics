import { Injectable } from '@angular/core';

declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class ParamsEventService {
  //
  public params_types: { [key: string]: Function } = {};

  public params: { [key: string]: Function } = {};

  constructor() {
    window._gh_register_params_key_type = this._register_params_key_type;
    window._gh_register_params = this._register_params;
  }


  _register_params_key_type=(key, event)=> {
    this.params_types[key] = event;
  }
  _register_params=(key, event)=> {
    this.params[key] = event;
  }
}
