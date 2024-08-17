import { Injectable } from '@angular/core';
interface Option {
  id: string,
  name: string,
  event: Function;
}
@Injectable({
  providedIn: 'root'
})
export class ImageToService {
  _data = {};

  constructor() { }

  register = (option: Option) => {
    const key = option.id;
    if (this._data[key]) this._data[key] = { ...this._data[key], ...option }
    else this._data[key] = option;
  }


}
