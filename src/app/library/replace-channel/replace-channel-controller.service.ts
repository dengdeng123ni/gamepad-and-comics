import { Injectable } from '@angular/core';
import { IndexdbControllerService, CacheControllerService, DbEventService, DbControllerService } from '../public-api';


declare global {
  interface Window {
    _gh_receive_message?: (message: any) => Promise<any>;
    _gh_send_message?: (message: any) => Promise<any>;
    _gh_menu_update?:Function
    _gh_page_reset?:Function
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReplaceChannelControllerService {

  private original = null;
  _data = {};

  constructor(
    public DbController:DbControllerService,
    public DbEvent: DbEventService,
    public webDb: IndexdbControllerService,
    public webCh: CacheControllerService
  ) {

    //
    window._gh_receive_message = this.receive_message
  }

  async init() {
    const events = {

    }
    Object.keys(this.DbEvent.Events).forEach(x => {
      if (!events[x]) events[x] = {}
      Object.keys(this.DbEvent.Events[x]).forEach(c => {
        events[x][c] = this.DbEvent.Events[x][c].bind(null);
      })
    })
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
    await this.send_message({
      function_name: 'db_event',
      target_source: 'other'
    })
    this.webDb.getAll = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'getAll',
        target_source: 'indexdb',

      })
      return res
    }
    this.webDb.update = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'update',
        target_source: 'indexdb',

      })
      return res
    }
    this.webDb.deleteByKey = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'deleteByKey',
        target_source: 'indexdb',

      })
      return res
    }
    this.webDb.getByKey = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'getByKey',
        target_source: 'indexdb',

      })
      return res
    }
    this.webCh.match = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'match',
        target_source: 'caches',

      })
      return res
    }
    this.webCh.put = async (...e): Promise<any> => {

      const res = await this.send_message({
        parameter: e,
        function_name: 'put',
        target_source: 'caches',

      })
      return res
    }
    this.webCh.delete = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'delete',
        target_source: 'caches',

      })
      return res
    }
    this.webCh.keys = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'keys',
        target_source: 'caches',

      })
      return res
    }
  }

  send_message = async (e) => {
    if (e.function_name == "put" && e.target_source == "caches") {
      e.parameter[2] = await this.responseToJson(e.parameter[2])
    } else if (e.function_name == "match" && e.target_source == "caches") {
      if (e.parameter[0] == "image") {
        const res = await this.original.webCh.match(...e.parameter)
        if (res) return res
      }
    }
    const res = await window._gh_send_message(e)

    if (!res.data) {
      return undefined
    } else if (res.req.function_name == "match") {
      const res1 = await this.jsonToResponse(res.data)
      if (res.req.parameter[0] == 'image') this.original.webCh.put(res.req.parameter[0], res.req.parameter[1], res1.clone())
      return res1
    } else if (res.req.function_name == "getImage") {
      return this.base64ToBlob(res.data)
    } else if (res.req.function_name == "db_event") {
      if(res.data.configs) this.DbEvent.Configs=res.data.configs;
      if(res.data.events){
        this.DbEvent.Events={};
        Object.keys(res.data.events).forEach(x => {
          if(!this.DbEvent.Events[x]) this.DbEvent.Events[x]={} as any;
          Object.keys(res.data.events[x]).forEach(c => {
            this.DbEvent.Events[x][c] = async (...e): Promise<any> => {
              const res = await this.send_message({
                parameter: e,
                function_name: c,
                source: x,
                target_source: 'builtin',

              })
              return res
            }
          })
        });
        if(window._gh_menu_update) window._gh_menu_update()
        if(window._gh_page_reset) window._gh_page_reset()
      }

    } else {
      return res.data
    }
  }
  receive_message = async (e) => {

    let res
    if (e.target_source == "indexdb") {
      res = await this.original.webDb[e.function_name](...e.parameter)
    } else if (e.target_source == "caches") {
      if (e.function_name == "put") {
        e.parameter[2] = await this.jsonToResponse(e.parameter[2])

        res = await this.original.webCh[e.function_name](...e.parameter)
      } else {
        res = await this.original.webCh[e.function_name](...e.parameter)
      }
      if (e.function_name == "match") {
        res = await this.responseToJson(res)
      }
    } else if (e.target_source == "builtin") {
      res = await this.original.DbEvent.Events[e.source][e.function_name](...e.parameter);
      if (e.function_name == "getImage") {
        res = await this.blobToBase64(res)
      }

    } else if (e.target_source == "other") {

      if (e.function_name == "db_event") {
        let events = {}
        Object.keys(this.original.DbEvent.Events).forEach(x => {
          if (!events[x]) events[x] = {}
          Object.keys(this.original.DbEvent.Events[x]).forEach(c => {
            events[x][c] = true;
          })
        })
        res = {
          events,
          configs: this.original.DbEvent.Configs
        }
      }
    }
    return { data: res, req: e }
  }
   blobToBase64=async (blob)=> {
    return new Promise((r, j) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        r(reader.result as string)
      };
      reader.onerror = () => {
        j("")
      }
    })
  }
  base64ToBlob=(base64Data)=> {
    // 提取 MIME 类型和 Base64 数据
    const [header, base64] = base64Data.split(',');
    const mimeType = header.match(/:(.*?);/)[1]; // 提取 MIME 类型

    // 解码 Base64 数据为二进制字符串
    const binaryString = window.atob(base64);

    // 将二进制字符串转换为 Uint8Array
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // 创建 Blob 并保留类型信息
    return new Blob([uint8Array], { type: mimeType });
  }
  responseToJson = async (response) => {
    if (!response) return response
    const responseJson = {
      status: response.status,
      statusText: response.statusText,
      headers: [], // 将 headers 转换为普通对象
      body: null,  // 将响应主体解析为 JSON
    };
    response.headers.forEach(function (value, name) { responseJson.headers.push({ value, name }) });
    const blob = await response.blob();

    responseJson.body = await this.blobToBase64(blob)
    return responseJson;
  }
  jsonToResponse = async (response) => {
    if (!response) return response
    const blob = this.base64ToBlob(response.body);
    const headers = new Headers();
    response.headers.forEach((x) => {
      headers.append(x.name, x.value);
    })

    return new Response(blob, {
      headers: headers,
      status: response.status,
      statusText: response.statusText,

    })

  }




}
