import { Injectable } from '@angular/core';
import { TranslateEventService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class TranslateControllerService {

  constructor(public TranslateEvent: TranslateEventService,

  ) {

  }

  getTranslation(key) {
    return this.TranslateEvent.Configs[key] ?? {}
  }
}
