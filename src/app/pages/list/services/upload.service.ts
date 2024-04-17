import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private db: NgxIndexedDBService
  ) {


  }


}
