import { Injectable } from '@angular/core';
import { IndexdbControllerService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private db: IndexdbControllerService
  ) {


  }


}
