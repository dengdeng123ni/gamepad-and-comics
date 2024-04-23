import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbEventService } from '../public-api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  origin = "bilibili"
  origin$ = new Subject();

  is_pulg = false;
  is_pwa = false;

  constructor(public DbEvent: DbEventService,
    public router: Router,

  ) {
    const c = localStorage.getItem('origin');
    if (c == "temporary_file") {
      this.router.navigate(['/']);
    }
    if (c) {
      this.origin = c;
    }
  }

  setOrigin(origin: string) {
    this.origin = origin;
    const x = this.DbEvent.Configs['origin']
    localStorage.setItem('origin', origin)
    this.origin$.next(x)
  }
  getOption() {
    return this.DbEvent.Configs[this.origin]
  }
}
