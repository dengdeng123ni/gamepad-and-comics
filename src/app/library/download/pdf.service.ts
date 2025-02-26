// @ts-nocheck
import { Injectable } from '@angular/core';
import { ImageService, PulgService, WorkerService } from '../public-api';
// declare const jsPDF: any;
@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    public image: ImageService,
    public appWorker: WorkerService,
    public pulg: PulgService) {

  }
  async createPdf(
    list: Array<string>, {
      isFirstPageCover = false,
      page = "double",
      pageOrder = false
    }) {
    const { jsPDF } = window.jspdf;

    const createImage = async (imageUrl) => {
      if (!imageUrl) return { width: 0, height: 0 }
      let obj = await createImageBitmap(await this.image.getImageBlob(imageUrl))
      // const res = await caches.match(imageUrl)
      // const str = await res.arrayBuffer();
      const str=await this.image.getImageBase64(imageUrl)

      return {
        width: obj.width,
        height: obj.height,
        src: str
      }
    }


    const pageOne = async (list) => {
      const doc = new jsPDF();
      doc.deletePage(1);

      for (let i = 0; i < list.length; i += 4) {
        const batch = list.slice(i, i + 4);
        const promises = await Promise.all(batch.map(x => createImage(x)));
        for (let index = 0; index < promises.length; index++) {
          const img: any = promises[index];
          if (img.height < img.width) {
            doc.addPage([img.width, img.height], "l")
          } else {
            doc.addPage([img.width, img.height], "p")
          }
          doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
        }

      }
      return doc.output('blob');
    }
    const pageDouble = async (list, isFirstPageCover) => {

      const doc = new jsPDF();
      console.log(doc);

      doc.deletePage(1);
      for (let i = 0; i < list.length;) {
        const img: any = await createImage(list[i]);
        const img1: any = await createImage(list[i + 1]);

        if (img.height > img.width && img1.height > img1.width) {
          if (i == 0 && isFirstPageCover == true) {
            doc.addPage([img.width * 2, img.height], "l")
            doc.addImage(img.src, 'WEBP', img.width, 0, img.width, img.height)
            i++;
          } else {
            doc.addPage([img.width + img1.width, ((img.height + img1.height) / 2)], "l")
            doc.addImage(img.src, 'WEBP', 0, 0, img.width, ((img.height + img1.height) / 2))
            doc.addImage(img1.src, 'WEBP', img.width, 0, img1.width, ((img.height + img1.height) / 2))
            i++;
            i++;
          }
        } else if (img.height < img.width && img1.height < img1.width) {
          doc.addPage([img.width, img.height], "l")
          doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1.src, 'WEBP', 0, 0, img1.width, img1.height)
          i++;
        } else if (img.height > img.width && img1.height < img1.width) {
          doc.addPage([img.width * 2, img.height], "l")
          doc.addImage(img.src, 'WEBP', img.width, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1.src, 'WEBP', 0, 0, img1.width, img1.height)
          i++;
        } else {
          if ((i + 1) == list.length) {
            if (img.height < img.width) {
              doc.addPage([img.width, img.height], "l")
              doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
              i++;
            } else {
              doc.addPage([img.width * 2, img.height], "l")
              doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
              i++;
            }
          } else {
            doc.addPage([img.width, img.height], "l")
            doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
            i++;
          }
        }
      }
      return doc.output('blob');
    }
    const pageDouble_reverse = async (list, isFirstPageCover) => {
      const doc = new jsPDF();
      doc.deletePage(1);
      console.log(doc);
      for (let i = 0; i < list.length;) {
        const img: any = await createImage(list[i]);
        const img1: any = await createImage(list[i + 1]);

        if (img.height > img.width && img1.height > img1.width) {
          if (i == 0 && isFirstPageCover == true) {
            doc.addPage([img.width * 2, img.height], "l")
            doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
            i++;
          } else {
            doc.addPage([img.width + img1.width, ((img.height + img1.height) / 2)], "l")
            doc.addImage(img1.src, 'WEBP', 0, 0, img1.width, ((img.height + img1.height) / 2))
            doc.addImage(img.src, 'WEBP', img1.width, 0, img.width, ((img.height + img1.height) / 2))
            i++;
            i++;
          }
        } else if (img.height < img.width && img1.height < img1.width) {
          doc.addPage([img.width, img.height], "l")
          doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1.src, 'WEBP', 0, 0, img1.width, img1.height)
          i++;
        } else if (img.height > img.width && img1.height < img1.width) {
          doc.addPage([img.width * 2, img.height], "l")
          doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1.src, 'WEBP', 0, 0, img1.width, img1.height)
          i++;
        } else {
          if ((i + 1) == list.length) {
            if (img.height < img.width) {
              doc.addPage([img.width, img.height], "l")
              doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
              i++;
            } else {
              doc.addPage([img.width * 2, img.height], "l")
              doc.addImage(img.src, 'WEBP', img.width, 0, img.width, img.height)
              i++;
            }
          } else {
            doc.addPage([img.width, img.height], "l")
            doc.addImage(img.src, 'WEBP', 0, 0, img.width, img.height)
            i++;
          }
        }
      }
      return doc.output('blob');
    }
    let bolb = null;
    if (page == "double") list = await this.appWorker.workerImageCompression(list, 1240, 0.92);
    console.log(list);

    if (page == "double" && pageOrder) bolb = await pageDouble(list, isFirstPageCover)
    else if (page == "double" && !pageOrder) bolb = await pageDouble_reverse(list, isFirstPageCover)
    else bolb = await pageOne(list)
    return bolb
  }



}
