import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigListService {

  constructor() { }

  edit = false;

  view={
    scrollTop:0,
    id:""
  }
}
