import { Injectable } from '@angular/core';
import { compressAccurately } from 'image-conversion';
import { DbControllerService, PulgService, RoutingControllerService } from 'src/app/library/public-api';
import { TemporaryDataControllerService } from 'src/app/library/temporary-data/temporary-data-controller.service';
@Injectable({
  providedIn: 'root'
})
export class PdfToImageService {

  constructor(
    public pulg:PulgService,
    public DbController: DbControllerService,
    public TemporaryDataController:TemporaryDataControllerService,
    public RoutingController:RoutingControllerService
  ) {

  }

  getFile = () => {
    return new Promise((r, j) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/pdf';
      fileInput.click();
      fileInput.addEventListener('change', function (event: any) {
        r(event.target.files[0])
      });
    })
  }

  async to() {
    const js1 = document.querySelector("base").href + 'assets/js/pdf.min.js'
    await this.pulg.loadBlobJs(js1)
    let file = await this.getFile() as any;
    let pdfData = await file.arrayBuffer();
    let title=file.name;
    const md5=await this.pulg.calculateBlobMD5(file);
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = document.querySelector("base").href + 'assets/js/pdf.worker.min.js'
    const pdf = await (window as any).pdfjsLib.getDocument(pdfData).promise;
    // 遍历每一页，将其渲染为图片
    let arr=[];
    let indexs=[];
    for (let i = 1; i <= pdf.numPages; i++) {
      indexs.push(i)
      arr.push(`http://localhost:7700/temporary_data/chapter/${md5}/${i}`)

    }
    await Promise.all(indexs.map(i=>this.add(pdf,i,md5)))
    const id = await this.TemporaryDataController.add_comics(arr, {
      title: title
    })
    this.RoutingController.routerReader('temporary_data', id)
  }
  async add(pdf,i,md5){
    const page = await pdf.getPage(i);
    // 设置渲染尺寸
    const viewport = page.getViewport({ scale: 2 }); // 缩放比例
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // 渲染 PDF 页面到 Canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    const blob= await this.scaleCanvas(canvas, 2480)
    await this.DbController.addImage(`http://localhost:7700/temporary_data/chapter/${md5}/${i}`,blob)
  }

  scaleCanvas(canvas, targetWidth = null, targetHeight = null) {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    // 计算宽高比
    const aspectRatio = originalWidth / originalHeight;

    // 根据指定的目标宽度或高度，计算另一个维度
    if (targetWidth && !targetHeight) {
      targetHeight = targetWidth / aspectRatio;
    } else if (targetHeight && !targetWidth) {
      targetWidth = targetHeight * aspectRatio;
    } else if (!targetWidth && !targetHeight) {
      throw new Error("必须至少指定 targetWidth 或 targetHeight");
    }

    // 创建一个临时 Canvas，用于存储原始内容
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = originalWidth;
    tempCanvas.height = originalHeight;

    // 将原始内容复制到临时 Canvas
    tempCtx.drawImage(canvas, 0, 0);

    // 调整原始 Canvas 的宽高
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 将临时 Canvas 的内容重新绘制到调整后的 Canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
    // const src = canvas.toDataURL("image/webp");
    return new Promise((r,j)=>{
      canvas.toBlob(async (blob) => {
        r(blob)
      },'image/webp')
    })


  }
  base64ToBlob(base64Data) {
    let arr = base64Data.split(','),
      fileType = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      l = bstr.length,
      u8Arr = new Uint8Array(l);

    while (l--) {
      u8Arr[l] = bstr.charCodeAt(l);
    }
    return new Blob([u8Arr], {
      type: fileType
    });
  }

}
