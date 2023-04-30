import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigDetailService {
  edit=false;
  mode="list";
  constructor() { }
}
