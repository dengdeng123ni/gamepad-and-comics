import { Injectable } from '@angular/core';
import { IndexdbControllerService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class CacheControllerService {

  data = {
    image: null,
    list: null,
    assets: null,
    script: null
  }
  is_cache = true;
  constructor(private webDb: IndexdbControllerService,) {
    window._gh_web_caches = {
      getAll: this.match,
      update: this.put,
      deleteByKey: this.delete,
      getByKey: this.keys
    }
  }


  async init() {
    if (window.caches) {
      this.data['image'] = await caches.open('image');
      this.data['list'] = await caches.open('list');
      this.data['assets'] = await caches.open('assets');
      this.data['script'] = await caches.open('script');
    } else {
      const res=(storeName)=>{
        return {
          match: async (request: string) => {
            try {
              const res: any = await this.webDb.getByKey(storeName, request)
              if (res) {
                const headers = new Headers();
                res.data.headers.forEach(([name, value]) => {
                  headers.append(name, value);
                });
                return new Response(new Blob([res.data.body]), {
                  status: res.data.status,
                  statusText: res.data.statusText,
                  headers: headers,
                });
              } else {
                return undefined
              }
            } catch (error) {
              return undefined
            }
          },
          put: async (request: string, response: Response) => {
            try {
              const buffer = await response.arrayBuffer();
              const headersArray = [];
              response.headers.forEach((value, name) => {
                headersArray.push([name, value]);
              });
              const data = {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                headers: headersArray,
                body: buffer,
              };
              await this.webDb.update(storeName, { id: request, data: data })
              return true
            } catch (error) {
              return false
            }
          },
          delete: async (request: string) => {
            try {
              await this.webDb.deleteByKey(storeName, request)
              return true
            } catch (error) {
              return false
            }
          },
          keys: async (request?: string) => {
            return []
          }
        }
      }
      this.data['image'] = res('caches_image')
      this.data['list'] = res('caches_list')
      this.data['assets'] = res('caches_assets')
      this.data['script'] = res('caches_script')
    }

  }

  public match = async (cacheName: "image" | "list" | "assets" | "script", request: string): Promise<Response | undefined> => {
    return await this.data[cacheName].match(request)
  }

  public put = async (cacheName: "image" | "list" | "assets" | "script", request: string, response: Response): Promise<void> => {
    return await this.data[cacheName].put(request, response)
  }

  public delete = async (cacheName: "image" | "list" | "assets" | "script", request: string): Promise<boolean> => {
    return await this.data[cacheName].delete(request)
  }
  public keys = async (cacheName: "image" | "list" | "assets" | "script", request?: string): Promise<ReadonlyArray<Request>> => {
    return await this.data[cacheName].keys(request)
  }
  public getAllcacheNames = async (): Promise<Array<string>> => {
    return ['image', 'list', 'assets', 'script']
  }



}
