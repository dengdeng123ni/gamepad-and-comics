import { Injectable } from '@angular/core';
import { IndexdbControllerService, CacheControllerService, DbEventService } from '../public-api';


declare global {
  interface Window {
    _gh_receive_message?: (message: any) => Promise<any>;
    _gh_send_message?: (message: any) => Promise<any>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReplaceChannelControllerService {

  private original = null;

  constructor(
    public DbEvent: DbEventService,
    public webDb: IndexdbControllerService,
    public webCh: CacheControllerService
  ) {
    //
    // window._gh_receive_message
  }

   async init() {
    const events={

    }
    Object.keys(this.DbEvent.Events).forEach(x => {
      if(!events[x]) events[x]={}
      Object.keys(this.DbEvent.Events[x]).forEach(c => {
        events[x][c] = this.DbEvent.Events[x][c].bind(null);
      })
    })
   this.DbEvent.Events
    this.original = {
      webDb: {
        getAll: this.webDb.getAll.bind(null),
        update: this.webDb.update.bind(null),
        deleteByKey: this.webDb.deleteByKey.bind(null),
        getByKey: this.webDb.getByKey.bind(null)
      },
      webCh: {
        match: this.webCh.match.bind(null),
        put: this.webCh.put.bind(null),
        delete: this.webCh.delete.bind(null),
        keys: this.webCh.keys.bind(null),
      },
      DbEvent: {
        Events: events,
        Configs: this.DbEvent.Configs
      }
    }
    this.webDb.getAll = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'getAll',
        target_source: 'indexdb',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }
    this.webDb.update = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'update',
        target_source: 'indexdb',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }
    this.webDb.deleteByKey = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'deleteByKey',
        target_source: 'indexdb',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }
    this.webDb.getByKey = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'getByKey',
        target_source: 'indexdb',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }

    this.webCh.match = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'match',
        target_source: 'caches',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }

    this.webCh.put = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'put',
        target_source: 'caches',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }

    this.webCh.delete = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'delete',
        target_source: 'caches',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }

    this.webCh.keys = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'keys',
        target_source: 'caches',
        id: Math.random().toString(36).substring(2, 9)
      })
      return res
    }
    console.log(this.DbEvent.Events);


    Object.keys(this.DbEvent.Events).forEach(x => {
      Object.keys(this.DbEvent.Events[x]).forEach(c => {
        this.DbEvent.Events[x][c] = async (...e): Promise<any> => {
          const res = await this.send_message({
            parameter: e,
            function_name: c,
            source:x,
            target_source: 'builtin',
            id: Math.random().toString(36).substring(2, 9)
          })
          return  res
        }
      })
    })

  }

  send_message = async (e) => {
    if (e.target_source == "indexdb") {
      return await this.original.webDb[e.function_name](...e.parameter)
    } else if (e.target_source == "caches") {
      return await this.original.webCh[e.function_name](...e.parameter)
    }else if (e.target_source == "builtin") {
      return await this.original.DbEvent.Events[e.source][e.function_name](...e.parameter)
    }
    return
  }

  receive_message = async (e) => {

    // return await window._gh_receive_message(e)
  }

}
