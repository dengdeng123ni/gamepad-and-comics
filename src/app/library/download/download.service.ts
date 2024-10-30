// @ts-nocheck
import { Injectable } from '@angular/core';
import { PdfService } from './pdf.service';
import { PptService } from './ppt.service';
import { ZipService } from './zip.service';
import { EpubService } from './epub.service';
import { PulgService } from '../public-api';
declare const JSZip: any;
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    public pdfService: PdfService,
    public pptService: PptService,
    public zipService: ZipService,
    public epubService: EpubService,
    public pulg: PulgService
  ) {

  }
  async pdf({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {
    const blob = await this.pdfService.createPdf(images, { pageOrder, isFirstPageCover, page })
    return blob
  }
  async ppt({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {
    const blob = await this.pptService.createPpt(images, { pageOrder, isFirstPageCover, page })
    return blob
  }
  async zip({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Array<Blob>> {
    const blobs = await this.zipService.createZip(images, { pageOrder, isFirstPageCover, page })
    let arr = [];
    blobs.forEach((blob, index) => {
      arr.push({ path: `${index + 1}`, blob: blob })
    })
    if (!arr.length) return

    var zip = new JSZip();
    arr.forEach(x => {
      const srcs = x.blob.type.split("/");
      let path = `${x.path}.${srcs.at(-1)}`;
      zip.file(path, x.blob)
    })
    const blob = await zip.generateAsync({ type: "blob" })
    return blob
  }
  async epub({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {
    const blob = await this.epubService.createEpub(images, { pageOrder, isFirstPageCover, page })

    return blob

  }

  async jpg({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {
    const blobs = await this.zipService.createZip(images, { pageOrder, isFirstPageCover, page })
    return blobs

  }

  async ImageToTypeBlob({ type, name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
    await this.pulg.load()
    console.log(name, images, pageOrder, isFirstPageCover, page);

    if (type == "PDF") return await this.pdf({ name, images, pageOrder, isFirstPageCover, page })
    if (type == "PPT") return await this.ppt({ name, images, pageOrder, isFirstPageCover, page })
    if (type == "ZIP") return await this.zip({ name, images, pageOrder, isFirstPageCover, page })
    if (type == "EPUB") return await this.epub({ name, images, pageOrder, isFirstPageCover, page })
    if (type == "JPG") return await this.jpg({ name, images, pageOrder, isFirstPageCover, page })
  }
  async download({ type, name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {

    if (type == "PDF") {
      const blob = await this.pdf({ name, images, pageOrder, isFirstPageCover, page })
      const srcs = blob.type.split("/");
      const path = `${name}.${srcs.at(-1)}`;
      this.saveAs(blob, path);
    }
    if (type == "PPT") {
      const blob = await this.ppt({ name, images, pageOrder, isFirstPageCover, page })
      const path = `${name}.pptx`;
      this.saveAs(blob, path);
    }
    if (type == "ZIP") {
      const blobs = await this.zip({ name, images, pageOrder, isFirstPageCover, page })
      let arr = [];
      blobs.forEach((blob, index) => {
        arr.push({ path: `${index + 1}`, blob: blob })
      })
      if (!arr.length) return

      var zip = new JSZip();
      arr.forEach(x => {
        const srcs = x.blob.type.split("/");
        let path = `${x.path}.${srcs.at(-1)}`;
        zip.file(path, x.blob)
      })
      zip.generateAsync({ type: "blob" }).then(function (content) {
        this.saveAs(content, `${name}`);
      })
    }
    if (type == "EPUB") {
      const blob = await this.epub({ name, images, pageOrder, isFirstPageCover, page })
      this.saveAs(blob, `${name}.epub`);
    }
  }
  saveAs(blob, fileName) {
    // data为blob格式
    var downloadElement = document.createElement('a');
    var href = URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    URL.revokeObjectURL(href);
  }
}
