import { Injectable } from '@angular/core';
import { Key, NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class IndexdbControllerService {

  constructor(private db: NgxIndexedDBService) { }

  getAll(storeName: string) {
    return this.db.getAll(storeName)
  }
  update(storeName: string, value: any) {
    return this.db.update(storeName, value)
  }
  getByID(storeName: string, id: string | number) {
    return this.db.getByID(storeName, id)
  }
  deleteByKey(storeName:string, key:Key){
    return this.db.deleteByKey(storeName, key)
  }
  getByKey(storeName:string, key:IDBValidKey){
    return this.db.getByKey(storeName, key)
  }
}
