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
  }


  async init() {
    this.data['image'] = await caches.open('image');
    this.data['list'] = await caches.open('list');
    this.data['assets'] = await caches.open('assets');
    this.data['script'] = await caches.open('script');
  }

  async match(cacheName: "image" | "list" | "assets" | "script", request:URL|string): Promise<Response | undefined> {
    return await this.data[cacheName].match(request)
  }

  async put(cacheName: "image" | "list" | "assets" | "script", request:URL|string, response: Response): Promise<void> {
    return await this.data[cacheName].put(request, response)
  }

  async delete(cacheName: "image" | "list" | "assets" | "script", request: RequestInfo | URL): Promise<boolean> {

    return await this.data[cacheName].delete(request)
  }
  async keys(cacheName: "image" | "list" | "assets" | "script",request?: RequestInfo | URL):Promise<ReadonlyArray<Request>>{
    return await this.data[cacheName].keys(request)
  }



}
