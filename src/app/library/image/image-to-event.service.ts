import { Injectable } from '@angular/core';
interface Option {
  id: string,
  name: string,
  event: Function;
  md?:''
}
@Injectable({
  providedIn: 'root'
})
export class ImageToEventService {

  _data = {};

  constructor() {
    //  this.register({
    //   id:'bvie',
    //   name:'测试',
    //   event:(blob)=>{
    //     console.log(blob);

    //     return blob
    //   }
    //  })
  }

  register = (option: Option) => {
    const key = option.id;
    if (this._data[key]) this._data[key] = { ...this._data[key], ...option }
    else this._data[key] = option;
  }


}
