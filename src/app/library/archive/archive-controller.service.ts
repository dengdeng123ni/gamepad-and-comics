import { Injectable } from '@angular/core';
import { CacheControllerService, DbControllerService, IndexdbControllerService } from '../public-api';
import CryptoJS from 'crypto-js'
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ArchiveControllerService {
  dirHandle = null;

  log$=new Subject();

  constructor(
    public webDb: IndexdbControllerService,
    private db: NgxIndexedDBService,
    public DbController: DbControllerService,
    public webCh: CacheControllerService
  ) {

  }

  async init() {
    //  const res= await this.webDb.getByKey('image','d5ff1662e9c3fd7b2d61194172c54f29')
    //  console.log(res);
    // file_download file_upload
  }

  export = async () => {
    const names = await this.webDb.getDbNames();

    for (let index = 0; index < names.length; index++) {
      const x = names[index];
      const res = await this.webDb.getAll(x as any)
      const blob = this.jsonToBlob(res)
      this.post(`data/IndexedDB/${x}.json`, blob)
      this.log$.next(`${index+1} ${names.length} data/IndexedDB/${x}.json`)
    }

    const script = await this.webDb.getAll('script') as any;
    for (let index = 0; index < script.length; index++) {
      const x = script[index];
      const c = await this.webCh.match('script', x.src)
      const blob = await c.blob();
      this.post(`data/Cache/script/${x.id}`, blob)
      this.log$.next(`${index+1} ${script.length} data/Cache/script/${x.id}`)
    }

    const image = await this.webDb.getAll('image') as any;
    for (let index = 0; index < image.length; index++) {
      const x = image[index];
      const c = await this.webCh.match('image', x.src)
      const blob = await c.blob();
      this.post(`data/Cache/image/${x.id}`, blob)
      this.log$.next(`${index+1} ${image.length} data/Cache/image/${x.id}`)
    }
    this.log$.next(`100%`)
  }

  import = async () => {
    const res = await this.getPaths();
    const names = await this.webDb.getDbNames();
    for (let index = 0; index < names.length; index++) {
      const x = names[index];
      const obj = res.find(c => c.path == `data/IndexedDB/${x}.json`)
      if (obj) {
        const file = await obj.dirHandle.getFile()
        const text = await file.text();
        const json = JSON.parse(text);
        for (let index = 0; index < json.length; index++) {
          await this.webDb.update(x as any, json[index])
          this.log$.next(`${index+1} ${json.length} data/IndexedDB/${x}.json`)
        }
      }
    }

    const script = await this.webDb.getAll('script') as any;
    for (let index = 0; index < script.length; index++) {
      const x = script[index];
      const obj = res.find(c => c.path == `data/Cache/script/${x.id}`)
      if (obj) {
        const file = await obj.dirHandle.getFile()
        await this.webCh.put('script', x.src, new Response(file))
        this.log$.next(`${index+1} ${script.length} data/Cache/script/${x.id}`)
      }
    }

    const image = await this.webDb.getAll('image') as any;
    for (let index = 0; index < image.length; index++) {
      const x = image[index];
      const obj = res.find(c => c.path == `data/Cache/image/${x.id}`)
      if (obj) {
        const file = await obj.dirHandle.getFile()
        await this.webCh.put('image', x.src, new Response(file))
        this.log$.next(`${index+1} ${script.length} data/Cache/image/${x.id}`)
      }
    }
    this.log$.next(`100%`)
  }

  async getPaths() {
    let paths = [];
    const handleDirectoryEntry = async (dirHandle: any, out: { [x: string]: {}; }, path: any) => {
      if (dirHandle.kind === "directory") {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file") {
            const arr = entry.name.split(".");
            out[entry.name] = { dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name };
            paths.push({ dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
          }
          if (entry.kind === "directory") {
            const newOut = out[entry.name] = {};
            await handleDirectoryEntry(entry, newOut, `${path}/${entry.name}`);
          }
        }
      }
      if (dirHandle.kind === "file") {
        const entry = dirHandle;
        const arr = entry.name.split(".");
        out[entry.name] = { dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name };
        paths.push({ dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
      }
    }
    await handleDirectoryEntry(this.dirHandle, {}, '')
    return paths
  }


  // caches
  jsonToBlob = (jsonData) => {
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: "application/json" });
    return blob;
  }

  async open() {
    try {
      this.dirHandle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
      return true
    } catch (error) {
      return false
    }
  }

  async post(path, blob): Promise<boolean> {
    try {
      const arr = path.split("/")
      const createDirHandle = async (dirHandle, path_arr, index) => {
        if ((path_arr.length - 1) == index) {
          for await (const it of dirHandle.values()) {
            if (it.name == path_arr[index]) {
              return null;
            }
          }
          const res = await dirHandle.getFileHandle(path_arr[index], {
            create: true,
          });
          return res
        } else {

          const res = await dirHandle.getDirectoryHandle(path_arr[index], {
            create: true,
          });
          index++;
          return await createDirHandle(res, path_arr, index)
        }
      }
      const dir = await createDirHandle(this.dirHandle, arr, 0)
      if (dir) {
        const writable = await dir.createWritable();
        await writable.write(blob);
        await writable.close();
      }
      return true
    } catch (error) {
      return false

    }

  }







}
