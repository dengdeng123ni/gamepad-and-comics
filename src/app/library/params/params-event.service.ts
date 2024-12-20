import { Injectable } from '@angular/core';

import CryptoJS from 'crypto-js'
@Injectable({
  providedIn: 'root'
})
export class ParamsEventService {
  //

  public Configs: { [key: string]: Array<string> } = {};


  public Events: { [key: string]: Function } = {};

  constructor() {
    window._gh_register_params = this._register_params;
  }

  _register_params=(parameterName, event)=> {
    const id = CryptoJS.MD5(JSON.stringify(parameterName)).toString().toLowerCase();
    this.Configs[id] = parameterName;
    this.Events[id] = event;
  }
}
