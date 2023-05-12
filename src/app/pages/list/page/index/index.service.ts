import { Injectable } from '@angular/core';
import { ConfigListService } from '../../services/config.service';
import { CurrentListService } from '../../services/current.service';
import { RegisterService } from '../../services/register.service';

@Injectable({
  providedIn: 'root'
})
export class IndexListService {

  constructor(
    public current:CurrentListService,
    public config:ConfigListService,
    public register:RegisterService,
    ) {

   }
}
