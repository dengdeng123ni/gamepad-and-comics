import { Injectable } from '@angular/core';
import { PdfService } from './pdf.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PptService } from './ppt.service';
import { ZipService } from './zip.service';
import { EpubService } from './epub.service';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    public pdfService: PdfService,
    public pptService: PptService,
    public zipService: ZipService,
    public epubService: EpubService
  ) { }
  async pdf({ name, chapters = [], pageOrder = false, isFirstPageCover = false, page, isMultipleDownloads = true }) {
    if(isMultipleDownloads){
      for (let i = 0; i < chapters.length; i++) {
        const x = chapters[i];
        const blob = await this.pdfService.createPdf(x.images.map(x => x.src), { pageOrder, isFirstPageCover, page })
        const srcs = blob.type.split("/");
        const path = `${name}_${x.title}.${srcs.at(-1)}`;
        saveAs(blob, path);
      }
      return
    }
    let arr = [];
    for (let i = 0; i < chapters.length; i++) {
      const x = chapters[i];
      const blob = await this.pdfService.createPdf(x.images.map(x => x.src), { pageOrder, isFirstPageCover, page })
      arr.push({ path: x.title, blob: blob })
    }
    if (!arr.length) return
    if (chapters.length == 1) {
      arr.forEach(x => {
        const srcs = x.blob.type.split("/");
        const path = `${name}_${x.path}.${srcs.at(-1)}`;
        saveAs(x.blob, path);
      })
      return
    }
    var zip = new JSZip();
    arr.forEach(x => {
      const srcs = x.blob.type.split("/");
      const path = `${name}/${x.path}.${srcs.at(-1)}`;
      zip.file(path, x.blob)
    })
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, name);
    })
  }
  async ppt({ name, chapters = [], pageOrder = false, isFirstPageCover = false, page, isMultipleDownloads = true }) {
    if(isMultipleDownloads){
      for (let i = 0; i < chapters.length; i++) {
        const x = chapters[i];
        const blob = await this.pptService.createPpt(x.images.map(x => x.src), { pageOrder, isFirstPageCover, page })
        const path = `${name}_${x.title}.pptx`;
        saveAs(blob, path);
      }
      return
    }
    let arr = [];
    for (let i = 0; i < chapters.length; i++) {
      const x = chapters[i];
      const blob = await this.pptService.createPpt(x.images.map(x => x.src), { pageOrder, isFirstPageCover, page })
      arr.push({ path: x.title, blob: blob })
    }
    if (!arr.length) return
    if (chapters.length == 1) {
      arr.forEach(x => {
        const path = `${name}_${x.path}.pptx`;
        saveAs(x.blob, path);
      })
      return
    }
    var zip = new JSZip();
    arr.forEach(x => {
      const path = `${name}/${x.path}.pptx`;
      zip.file(path, x.blob)
    })
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, name);
    })
  }
  async zip({ name, chapters = [], pageOrder = false, isFirstPageCover = false, page , isMultipleDownloads = true}) {
    if (chapters.length == 1) {
      let arr = [];
      for (let i = 0; i < chapters.length; i++) {
        const x = chapters[i];
        const blobs = await this.zipService.createZip(x.images.map(x => x.src), { pageOrder, isFirstPageCover, page })
        blobs.forEach((blob, index) => {
          arr.push({ path: `${index + 1}`, blob: blob })
        })
      }
      if (!arr.length) return

      var zip = new JSZip();
      arr.forEach(x => {
        const srcs = x.blob.type.split("/");
        let path = `${x.path}.${srcs.at(-1)}`;
        zip.file(path, x.blob)
      })
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${name}_${chapters[0].title}`);
      })
    } else {
      let arr = [];
      for (let i = 0; i < chapters.length; i++) {
        const x = chapters[i];
        const blobs = await this.zipService.createZip(x.images.map(x => x.src), { pageOrder, isFirstPageCover, page })
        blobs.forEach((blob, index) => {
          arr.push({ path: `${x.title}/${index + 1}`, blob: blob })
        })
      }
      if (!arr.length) return

      var zip = new JSZip();
      arr.forEach(x => {
        const srcs = x.blob.type.split("/");
        let path = `${name}/${x.path}.${srcs.at(-1)}`;
        zip.file(path, x.blob)
      })
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, name);
      })
    }
  }
  async epub({ name, chapters = [], pageOrder = false, isFirstPageCover = false, page }) {
    let arr = [];
    for (let i = 0; i < chapters.length; i++) {
      const x = chapters[i];
      const blob = await this.epubService.createEpub(x.images.map(x => x.src), { pageOrder, isFirstPageCover, page })
      arr.push({ path: x.title, blob: blob })
    }
    arr.forEach(x => {
      const path = `${name}_${x.path}.epub`;
      saveAs(x.blob, path);
    })
    return

  }
}
