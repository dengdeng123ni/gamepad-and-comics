// @ts-nocheck
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
  ) { }
  async pdf({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {

  }
  async ppt({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {

  }
  async zip({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Array<Blob>> {

  }
  async epub({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {


  }

  async jpg({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {

  }

  async ImageToTypeBlob({ type, name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
  }
  async download({ type, name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {


  }

}
