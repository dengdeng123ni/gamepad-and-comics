import { Injectable } from '@angular/core';

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
  constructor() {
    this.init();
  }


  async init() {
    this.data['image'] = await caches.open('image');
    this.data['list'] = await caches.open('list');
    this.data['assets'] = await caches.open('assets');
    this.data['script'] = await caches.open('script');
  }

  async match(cacheName: "image" | "list" | "assets" | "script", request: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response | undefined> {
    return this.data[cacheName].match(request, options)
  }

  async put(cacheName: "image" | "list" | "assets" | "script", request: RequestInfo | URL, response: Response): Promise<void> {
    return this.data[cacheName].put(request, response)
  }

  async delete(cacheName: "image" | "list" | "assets" | "script", request: RequestInfo | URL, options?: CacheQueryOptions): Promise<boolean> {
    return this.data[cacheName].delete(request, options)
  }
  keys(cacheName: "image" | "list" | "assets" | "script",request?: RequestInfo | URL, options?: CacheQueryOptions):Promise<ReadonlyArray<Request>>{
    return this.data[cacheName].key(request, options)
  }


}
