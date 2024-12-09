import { Injectable } from '@angular/core';
import { Key, NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IndexdbControllerService {

  constructor(private db: NgxIndexedDBService) {
    // window._gh_send_message
    // window._gh_receive_message\


  }

  public getAll = async (storeName: string) => {
    const res = await firstValueFrom(this.db.getAll(storeName))
    return res
  }
  public update = async (storeName: string, value: any) => {
    const res = await firstValueFrom(this.db.update(storeName, value))
    return res
  }
  public deleteByKey = async (storeName: string, key: Key) => {
    const res = await firstValueFrom(this.db.deleteByKey(storeName, key))
    return res
  }
  public getByKey = async (storeName: string, key: IDBValidKey) => {
    const res = await firstValueFrom(this.db.getByKey(storeName, key))
    return res
  }

}
