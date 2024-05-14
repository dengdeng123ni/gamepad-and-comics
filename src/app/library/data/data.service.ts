import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbEventService } from '../public-api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  origin = ""
  origin$ = new Subject();

  is_pulg = false;
  is_pwa = false;
  is_web_worker=false;

  originConfig={};
  constructor(public DbEvent: DbEventService,
    public router: Router,

  ) {
    this.origin = localStorage.getItem('origin');
  }
  init(){
    const c = localStorage.getItem('origin');
    if (c == "temporary_file") {
      this.router.navigate(['/']);
    }
    if (c) {
      this.setOrigin(c)
    }
  }

  setOrigin(origin: string) {
    this.origin = origin;
    const x = this.DbEvent.Configs[origin];
    if(x) this.originConfig=x;
    this.origin$.next(x)
    localStorage.setItem('origin', origin)
  }
  getOption() {
    return this.DbEvent.Configs[this.origin]
  }
}
