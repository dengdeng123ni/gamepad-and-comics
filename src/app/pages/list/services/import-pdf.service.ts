import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { compressAccurately } from 'image-conversion';
import * as PDFJS from 'pdfjs-dist/build/pdf'
import PDFJSWorker from 'pdfjs-dist/build/pdf.worker.entry.js'
PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;

@Injectable({
  providedIn: 'root'
})
export class ImportPdfService {
  constructor(
    public _dialog: MatDialog
  ) {

  }
  pdfToImages(url: string, index = 1) {

    return new Promise((r, j) => {

      const createImage = async (imageUrl): Promise<ImageBitmap> =>  await createImageBitmap(await fetch(imageUrl).then((r) => r.blob()))
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
        let dataURL = canvas.toDataURL("image/jpeg", 0.8);


        return new Promise((r, j) => {
          var img = new Image();
          img.src = dataURL;
          img.onload = function () {
            r(img)
            j(img)
          };
        })
      }
      let loadingTask: any = PDFJS.getDocument({
        data: url
      });

      loadingTask.promise.then((pdf: any) => {
        let arr = [];
        let numPages = pdf.numPages;
        let scale = 2;
        let Mycanvas = document.createElement("canvas");
        let height = 0;
        let width = 0;
        let okRender = new Promise(async (res: any, rej) => {
          for (let i = index; i <= numPages; i++) {
            let page = await pdf.getPage(i);
            let viewport = page.getViewport({
              scale: scale,
            });
            let canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            let context = canvas.getContext("2d");
            let renderContext = {
              canvasContext: context, // 此为canvas的context
              viewport: viewport,
            };
            let success = await page.render(renderContext).promise;
            if (i === 1) {
              height = viewport.height;
              width = viewport.width;
              Mycanvas.height = viewport.height * numPages;
              Mycanvas.width = viewport.width;
            }

            let dataURL = canvas.toDataURL("image/png", 1);
            const blob = await this.base64ToBlob(dataURL, "image/png");
            arr.push(blob)
            if (i === numPages) {
              res(arr);
            }
          }
        });
        okRender.then(x => {
          r(x)
          j(x)
        });
      });
    })
  };
  base64ToBlob(urlData, type) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || type;
    // 去掉url的头，并转化为byte
    let bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mime
    });
  }
  async init(file):Promise<any> {
   const arr= await this.pdfToImages(file)
   return arr
  }


  unique(arr) {
    return arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
  }
}
