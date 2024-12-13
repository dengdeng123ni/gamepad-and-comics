import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbEventService } from '../public-api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  source = ""
  source$ = new Subject();

  is_pulg = false;
  is_pwa = false;
  is_web_worker=false;
  public sourceChange() {
    return this.source$
  }
  sourceConfig={};
  constructor(public DbEvent: DbEventService,
    public router: Router,

  ) {
  }
  init(){
    if (false) {
      this.router.navigate(['/']);
    }
  }

  setsource(source: string) {
    this.source = source;
    const x = this.DbEvent.Configs[source];
    if(x) this.sourceConfig=x;
    if(x) this.source$.next(x)
    document.body.setAttribute('source',source)
  }
  getOption() {
    return this.DbEvent.Configs[this.source]
  }
}
