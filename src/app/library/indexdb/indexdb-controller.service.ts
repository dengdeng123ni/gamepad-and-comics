import { Injectable } from '@angular/core';
import { Key, NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IndexdbControllerService {

  constructor(private db: NgxIndexedDBService) { }

  getAll(storeName: string) {
    console.log(storeName);

    return firstValueFrom(this.db.getAll(storeName))
  }
  update(storeName: string, value: any) {
    console.log(storeName,value);

    return firstValueFrom(this.db.update(storeName, value))
  }
  deleteByKey(storeName:string, key:Key){
    return firstValueFrom(this.db.deleteByKey(storeName, key))
  }
  getByKey(storeName:string, key:IDBValidKey){
    console.log(storeName,key);
    return firstValueFrom(this.db.getByKey(storeName, key))
  }

}
