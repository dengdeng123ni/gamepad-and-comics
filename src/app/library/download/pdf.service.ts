// @ts-nocheck
import { Injectable } from '@angular/core';
import { ImageService,PulgService } from '../public-api';
// declare const jsPDF: any;
@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(public image:ImageService,public pulg:PulgService) {

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
      return await createImageBitmap(await this.image.getImageBlob(imageUrl))
    }

    const compressImage = async (src) => {
      if (!src) {
        return {
          width: 0,
          height: 0
        }
      }
      const image1 = await createImage(src) as any;
      let canvas = document.createElement('canvas');
      canvas.width = image1.width;
      canvas.height = image1.height;
      if (canvas.width > canvas.height) {
        canvas.width = 2480;
        canvas.height = 2480 * (image1.height / image1.width);
      } else {
        canvas.width = 1240;
        canvas.height = 1240 * (image1.height / image1.width);
      }
      let context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.drawImage(image1, 0, 0, canvas.width, canvas.height);
      let dataURL = canvas.toDataURL("image/webp",0.92);
      return new Promise((r, j) => {
        var img = new Image();
        img.src = dataURL;
        img.onload = function () {
          r(img)
          j(img)
        };
      })
    }
    const pageOne = async (list) => {
      const doc = new jsPDF();
      doc.deletePage(1);

      for (let i = 0; i < list.length; i += 4) {
        const batch = list.slice(i, i + 4);
        const promises = await Promise.all(batch.map(x => compressImage(list[i])));
        for (let index = 0; index < promises.length; index++) {
          const img: any =  promises[index];
          if (img.height < img.width) {
            doc.addPage([img.width, img.height], "l")
          } else {
            doc.addPage([img.width, img.height], "p")
          }
          doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
        }

      }
      return doc.output('blob');
    }
    const pageDouble = async (list, isFirstPageCover) => {
      const doc = new jsPDF();
      doc.deletePage(1);
      for (let i = 0; i < list.length;) {
        const img: any = await compressImage(list[i]);
        const img1: any = await compressImage(list[i + 1]);
        if (img.height > img.width && img1.height > img1.width) {
          if (i == 0 && isFirstPageCover == true) {
            doc.addPage([img.width * 2, img.height], "l")
            doc.addImage(img, 'JPG', img.width, 0, img.width, img.height)
            i++;
          } else {
            doc.addPage([img.width + img1.width, ((img.height + img1.height) / 2)], "l")
            doc.addImage(img, 'JPG', 0, 0, img.width, ((img.height + img1.height) / 2))
            doc.addImage(img1, 'JPG', img.width, 0, img1.width, ((img.height + img1.height) / 2))
            i++;
            i++;
          }
        } else if (img.height < img.width && img1.height < img1.width) {
          doc.addPage([img.width, img.height], "l")
          doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1, 'JPG', 0, 0, img1.width, img1.height)
          i++;
        } else if (img.height > img.width && img1.height < img1.width) {
          doc.addPage([img.width * 2, img.height], "l")
          doc.addImage(img, 'JPG', img.width, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1, 'JPG', 0, 0, img1.width, img1.height)
          i++;
        } else {
          if ((i + 1) == list.length) {
            if (img.height < img.width) {
              doc.addPage([img.width, img.height], "l")
              doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
              i++;
            } else {
              doc.addPage([img.width * 2, img.height], "l")
              doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
              i++;
            }
          } else {
            doc.addPage([img.width, img.height], "l")
            doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
            i++;
          }
        }
      }
      return doc.output('blob');
    }
    const pageDouble_reverse = async (list, isFirstPageCover) => {
      const doc = new jsPDF();
      doc.deletePage(1);
      for (let i = 0; i < list.length;) {
        const img: any = await compressImage(list[i]);
        const img1: any = await compressImage(list[i + 1]);
        if (img.height > img.width && img1.height > img1.width) {
          if (i == 0 && isFirstPageCover == true) {
            doc.addPage([img.width * 2, img.height], "l")
            doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
            i++;
          } else {
            doc.addPage([img.width + img1.width, ((img.height + img1.height) / 2)], "l")
            doc.addImage(img1, 'JPG', 0, 0, img1.width, ((img.height + img1.height) / 2))
            doc.addImage(img, 'JPG', img1.width, 0, img.width, ((img.height + img1.height) / 2))
            i++;
            i++;
          }
        } else if (img.height < img.width && img1.height < img1.width) {
          doc.addPage([img.width, img.height], "l")
          doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1, 'JPG', 0, 0, img1.width, img1.height)
          i++;
        } else if (img.height > img.width && img1.height < img1.width) {
          doc.addPage([img.width * 2, img.height], "l")
          doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
          i++;
          doc.addPage([img1.width, img1.height], "l")
          doc.addImage(img1, 'JPG', 0, 0, img1.width, img1.height)
          i++;
        } else {
          if ((i + 1) == list.length) {
            if (img.height < img.width) {
              doc.addPage([img.width, img.height], "l")
              doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
              i++;
            } else {
              doc.addPage([img.width * 2, img.height], "l")
              doc.addImage(img, 'JPG', img.width, 0, img.width, img.height)
              i++;
            }
          } else {
            doc.addPage([img.width, img.height], "l")
            doc.addImage(img, 'JPG', 0, 0, img.width, img.height)
            i++;
          }
        }
      }
      return doc.output('blob');
    }
    let bolb = null;
    if (page == "double" && pageOrder) bolb = await pageDouble(list, isFirstPageCover)
    else if (page == "double" && !pageOrder) bolb = await pageDouble_reverse(list, isFirstPageCover)
    else bolb = await pageOne(list)
    return bolb
  }



}
