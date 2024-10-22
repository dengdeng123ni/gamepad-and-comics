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

  sourceConfig={};
  constructor(public DbEvent: DbEventService,
    public router: Router,

  ) {
    this.source = localStorage.getItem('source');
  }
  init(){
    const c = localStorage.getItem('source');
    if (c == "temporary_file") {
      this.router.navigate(['/']);
    }
    if (c) {
      this.setsource(c)
    }
  }

  setsource(source: string) {
    this.source = source;
    const x = this.DbEvent.Configs[source];
    if(x) this.sourceConfig=x;
    this.source$.next(x)
    localStorage.setItem('source', source)
  }
  getOption() {
    return this.DbEvent.Configs[this.source]
  }
}
