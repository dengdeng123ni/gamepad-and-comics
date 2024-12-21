import { Injectable } from '@angular/core';
import { IndexdbControllerService, CacheControllerService, DbEventService, DbControllerService, ReplaceChannelEventService, ParamsEventService } from '../public-api';

import CryptoJS from 'crypto-js'


@Injectable({
  providedIn: 'root'
})
export class ReplaceChannelControllerService {

  public original = null;
  _data = {};

  send_client_id = null;
  receiver_client_id = null;
  replace_channel_id = null;

  is_enabled = true;

  add$

  old_data = null

  is_free = false;

  current_md5 = "";

  is_loading_free = false;
  constructor(
    public ReplaceChannelEvent: ReplaceChannelEventService,
    public DbController: DbControllerService,
    public DbEvent: DbEventService,
    public webDb: IndexdbControllerService,
    public ParamsEvent: ParamsEventService,
    public webCh: CacheControllerService
  ) {

    window._gh_receive_message = this.receive_message
    ParamsEvent._register_params(['receiver_client_id', 'replace_channel_id', 'is_enabled'], obj => {
      this.change(obj.receiver_client_id, obj.replace_channel_id, obj.is_enabled == "true" ? true : false)
    })
    this.add$ = this.ReplaceChannelEvent.add().subscribe(x => {
      this.default_trigger()
    })
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
        getByKey: this.webDb.getByKey.bind(null),
        getDbNames: this.webDb.getByKey.bind(null),
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
    this.default_trigger()
  }
  goBack() {
    this.webCh.match = this.original.webCh.match.bind(null);
    this.webCh.put = this.original.webCh.put.bind(null);
    this.webCh.delete = this.original.webCh.delete.bind(null);
    this.webCh.keys = this.original.webCh.keys.bind(null);

    this.webDb.getAll = this.original.webDb.getAll.bind(null);
    this.webDb.update = this.original.webDb.update.bind(null);
    this.webDb.deleteByKey = this.original.webDb.deleteByKey.bind(null);
    this.webDb.getByKey = this.original.webDb.getByKey.bind(null);
    this.webDb.getDbNames = this.original.webDb.getDbNames.bind(null);

    const events = {

    }
    Object.keys(this.original.DbEvent.Events).forEach(x => {
      if (!events[x]) events[x] = {}
      Object.keys(this.original.DbEvent.Events[x]).forEach(c => {
        events[x][c] = this.original.DbEvent.Events[x][c].bind(null);
      })
    })
    this.DbEvent.Events = events;
    this.DbEvent.Configs = this.original.DbEvent.Configs;

    if (window._gh_menu_update) window._gh_menu_update()
    if (window._gh_page_reset) window._gh_page_reset()
    this.enabled_change(false);
    document.body.setAttribute('receiver_client_id', "")
    document.body.setAttribute('replace_channel_id', "")
    // window.location.reload();

  }
  replaceWebDb_WebCh() {
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
    this.webDb.getDbNames = async (...e): Promise<any> => {
      const res = await this.send_message({
        parameter: e,
        function_name: 'getDbNames',
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
  async default_trigger() {

    if (this.is_free) return
    if (!this.original?.webDb?.getByKey ) return
    if (this.old_data) {

    } else {
      this.old_data = await this.original.webDb.getByKey('data', '_replace_channel')
    }
    if (this.old_data && this.old_data.is_enabled) {
      const res = await this.original.webDb.getByKey('data', '_replace_channel_db_event')
      if (res) {
        if (res.configs) this.DbEvent.Configs = res.configs;
        if (res.events) {
          this.DbEvent.Events = {};
          Object.keys(res.events).forEach(x => {
            if (!this.DbEvent.Events[x]) this.DbEvent.Events[x] = {} as any;
            Object.keys(res.events[x]).forEach(c => {
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
          if (window._gh_menu_update) window._gh_menu_update()
          if (window._gh_page_reset) window._gh_page_reset()
          this.current_md5 = res.md5;
        }
        this.replaceWebDb_WebCh()
      }
      const bool = Object.keys(this.ReplaceChannelEvent.Configs).includes(this.old_data.replace_channel_id);
      if (bool) {
        const list = await this.ReplaceChannelEvent.Events[this.old_data.replace_channel_id].getAll()
        const obj = list.find(x => this.old_data.receiver_client_id == x.id)
        if (obj) {

          const bool = await this.change(obj.id, this.old_data.replace_channel_id, true)
          if (!bool) {

          } else {
            this.is_free = true;
            this.old_data = null;
          }
        }
      }
    } else {
      this.is_enabled = false;
    }
  }

  enabled_change = async (is_enabled) => {
    const res = await this.original.webDb.getByKey('data', '_replace_channel')
    await this.original.webDb.update('data', { ...res, is_enabled })
  }

  async change(receiver_client_id: string, replace_channel_id: string, is_enabled: boolean) {
    try {
      this.receiver_client_id = receiver_client_id;
      this.replace_channel_id = replace_channel_id;
      document.body.setAttribute('receiver_client_id', receiver_client_id)
      document.body.setAttribute('replace_channel_id', replace_channel_id)
      document.body.setAttribute('replace_channel', 'true')

      await this.original.webDb.update('data', { id: '_replace_channel', is_enabled: is_enabled, receiver_client_id: receiver_client_id, replace_channel_id: replace_channel_id })

      await this.send_message({
        function_name: 'db_event',
        target_source: 'other'
      })
      this.replaceWebDb_WebCh()
      return true
    } catch (error) {
      return false
    }



  }

  send_message = async (e) => {
    if (e.target_source == "caches") {
      if (e.function_name == "match") {
        if (e.parameter[0] == "image") {
          const res = await this.original.webCh.match(...e.parameter)
          if (res) return res
        }
      } else if (e.function_name == "put") {
        if (e.parameter[0] === "image") {
          await this.original.webCh.put(e.parameter[0], e.parameter[1], e.parameter[2].clone())
        }
        e.parameter[2] = await this.responseToJson(e.parameter[2].clone())
      }
    } else if (e.target_source == "indexdb") {
      if (e.function_name == "getByKey") {
        if (e.parameter[0] == "details") {
          const res = await this.original.webDb.getByKey(...e.parameter)
          if (res) return res
        } else if (e.parameter[0] == "pages") {
          const res = await this.original.webDb.getByKey(...e.parameter)
          if (res) return res
        } else if (e.parameter[0] == "comics_config") {
          const res = await this.original.webDb.getByKey(...e.parameter)
          return res
        }
      } else if (e.function_name == "update") {
        if (e.parameter[0] == "history") {
          this.original.webDb.update(...e.parameter)
        }
        if (e.parameter[0] == "local_pages") {
          this.original.webDb.update(...e.parameter)
        }
        if (e.parameter[0] == "pages") {
          this.original.webDb.update(...e.parameter)
        }
        if (e.parameter[0] == "local_comics") {
          this.original.webDb.update(...e.parameter)
        }
        if (e.parameter[0] == "details") {
          this.original.webDb.update(...e.parameter)
        }
      }
    }
    let res;
    if (this.receiver_client_id) {
      res = await this.ReplaceChannelEvent.Events[this.replace_channel_id].sendMessage({
        send_client_id: this.send_client_id,
        receiver_client_id: this.receiver_client_id,
        data: e
      })
    } else {
      res = await this.receive_message(e)
    }
    if (!res) return undefined

    if (!res.data) {
      return undefined
    } else if (res.req.target_source == "indexdb") {
      if (res.req.function_name == "getByKey") {
        if (res.req.parameter[0] == "details") {
          this.original.webDb.update(res.req.parameter[0], res.data)
          return res.data
        } else if (res.req.parameter[0] == "pages") {
          this.original.webDb.update(res.req.parameter[0], res.data)
          return res.data
        } else if (res.req.parameter[0] == "image") {
          console.log(res.req.parameter[0]);

          this.original.webDb.update(res.req.parameter[0], res.data)
          return res.data
        }
      }
      return res.data
    } else if (res.req.function_name == "match") {
      const res1 = await this.jsonToResponse(res.data)
      if (res.req.parameter[0] == 'image') {
        const id = CryptoJS.MD5(res.req.parameter[1]).toString().toLowerCase();
        this.webDb.getByKey('image', id)
        this.original.webCh.put(res.req.parameter[0], res.req.parameter[1], res1.clone())
      }
      return res1.clone()
    } else if (res.req.function_name == "getImage") {
      const res1 = this.base64ToBlob(res.data)
      return res1
    } else if (res.req.function_name == "db_event") {
      if (res.data.client_id == this.send_client_id) return

      await this.original.webDb.update('data', {
        id: "_replace_channel_db_event",
        ...res.data
      })
      if (res.data.configs) this.DbEvent.Configs = res.data.configs;
      if (res.data.events) {
        this.DbEvent.Events = {};
        Object.keys(res.data.events).forEach(x => {
          if (!this.DbEvent.Events[x]) this.DbEvent.Events[x] = {} as any;
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
        if (window._gh_menu_update) window._gh_menu_update()
        if (window._gh_page_reset) window._gh_page_reset()
      }

    } else {
      return res.data
    }
  }
  receive_message = async (e) => {
    try {
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

          const id = CryptoJS.MD5(JSON.stringify(
            {
              events,
              configs: this.original.DbEvent.Configs
            }
          )).toString().toLowerCase();
          res = {
            events,
            configs: this.original.DbEvent.Configs,
            client_id: this.send_client_id
          }
        }
      }
      return { data: res, req: e }
    } catch (error) {
      console.log(error);

      return { data: null, req: e }
    }


  }
  blobToBase64 = async (blob) => {
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
  base64ToBlob = (base64Data) => {
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
    const res = new Blob([uint8Array], { type: mimeType })


    return res;
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
