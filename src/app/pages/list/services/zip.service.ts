import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor() { }
  async create(arr1: Array<{ path: string, src: string }>) {
    const { arr, paths } = await this.getImageBlob(arr1);
    const json = new Blob([JSON.stringify(paths)], { type: 'application/json' })
    var zip = new JSZip();
    const response = await fetch("assets/zip/dist.zip");
    const zipBlob = await response.blob();
    let index = 0;
    zip.loadAsync(zipBlob).then(function (zip) {
      // 解析后，您可以遍历zip文件并访问其中的内容。
      const total = Object.keys(zip.files).length;

      zip.forEach(async function (relativePath, file) {
        if (!file.dir) {
          const blob = await file.async("blob")
          zip.file(relativePath, blob);
        }
        index++;
        if (index == total) {
          arr.forEach(x => {
            zip.file(x.path, x.blob)
          })
          zip.file(`dist/assets/images/index.json`, json)
          zip.file(`dist/assets/zip/dist.zip`, zipBlob)
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "dist.zip");
          })
        }
      });

    });
  }
  async getImageBlob(images: Array<{ path: string, src: string }>) {
    let arr = [];
    let paths = [];
    for (let i = 0; i < images.length; i++) {
      const x = images[i];
      const response = await fetch(x.src);
      const blob = await response.blob();
      const srcs = blob.type.split("/");
      const path = `${x.path}.${srcs.at(-1)}`;
      arr.push({ path: `dist/assets/images/${path}`, blob: blob })
      paths.push(path);
    }
    return { arr, paths }
  }

}
