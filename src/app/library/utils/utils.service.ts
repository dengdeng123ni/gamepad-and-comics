import { Injectable } from '@angular/core';
import { ImagesService } from './images.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public Images:ImagesService) { }

}
