import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateEventService {
  public Configs: { [key: string]: any } = {};

  private updateSubject = new Subject<string>();

  update$ = this.updateSubject.asObservable();
  constructor() {

    setTimeout(() => {
      this.register('ru', { 历史记录: "历史记录1" })
    })
    window._gh_translate_register = this.register
  }

  register = (key: string, value = {}) => {
    if (this.Configs[key]) this.Configs = { ...this.Configs, value }
    else this.Configs[key] = value;
    this.updateSubject.next(key);
  }
}
