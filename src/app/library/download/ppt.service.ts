// @ts-nocheck
import { Injectable } from '@angular/core';
import { ImageService } from '../public-api';
declare const pptxgen: any;
@Injectable({
  providedIn: 'root'
})
export class PptService {

  constructor(public image:ImageService) { }
  async createPpt(
    list: Array<string>, {
    isFirstPageCover = false,
    page = "double",
    pageOrder = false
  }) {
    const pageOne = async (list) => {
      let ppt = new PptxGenJS();
      for (let i = 0; i < list.length; i++) {
        const img: any = await this.getImageBase64([list[i]]);
        let slide = ppt.addSlide();
        slide.background = { color: "282828" };
        const w = (img.width / (img.height * (16 / 9))) * 100;
        const ml = (100 - w) / 2;
        slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
      }
      return ppt.write()
    }
    const pageDouble_reverse = async (list,isFirstPageCover) => {
      let ppt = new PptxGenJS();
      for (let i = 0; i < list.length;) {
        const img: any = await this.getImageBase64([list[i]]);
        const img1: any = await this.getImageBase64([list[i + 1]]);
        if (img.height > img.width && img1.height > img1.width) {
          if (i == 0 && isFirstPageCover == true) {
            let slide = ppt.addSlide();
            slide.background = { color: "282828" };
            const w = (img.width / (img.height * (16 / 9))) * 100;
            const ml = (100 - w*2) / 2;
            slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
            i++;
          } else {
            let slide = ppt.addSlide();
            slide.background = { color: "282828" };
            const w = (img.width / (img.height * (16 / 9))) * 100;
            const w1 = (img1.width / (img1.height * (16 / 9))) * 100;
            const ml = (100 - (w1 + w)) / 2;
            slide.addImage({ data: img1.dataURL, h: "100%", w: `${w1}%`, x: `${ml}%` })
            slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml + w1}%` })
            i++;
            i++;
          }
        } else if (img.height < img.width && img1.height < img1.width) {
          let slide = ppt.addSlide();
          slide.background = { color: "282828" };
          const w = (img.width / (img.height * (16 / 9))) * 100;
          const ml = (100 - w) / 2;
          slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          i++;
          let slide1 = ppt.addSlide();
          slide1.background = { color: "282828" };
          const w1 = (img1.width / (img1.height * (16 / 9))) * 100;
          const ml1 = (100 - w1) / 2;
          slide1.addImage({ data: img1.dataURL, h: "100%", w: `${w1}%`, x: `${ml1}%` })
          i++;
        } else if (img.height > img.width && img1.height < img1.width) {
          let slide = ppt.addSlide();
          slide.background = { color: "282828" };
          const w = (img.width / (img.height * (16 / 9))) * 100;

          const ml = (100 - w*2) / 2;
          slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          // if(i == 0){
          //   const ml = (100 - w*2) / 2;
          //   slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          // }else{
          //   const ml = (100 - w) / 2;
          //   slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          // }
          i++;
          let slide1 = ppt.addSlide();
          slide1.background = { color: "282828" };
          const w1 = (img1.width / (img1.height * (16 / 9))) * 100;
          const ml1 = (100 - w1) / 2;
          slide1.addImage({ data: img1.dataURL, h: "100%", w: `${w1}%`, x: `${ml1}%` })
          i++;
        } else {
          if ((i + 1) == list.length) {
            if (img.height < img.width) {
              let slide = ppt.addSlide();
              slide.background = { color: "282828" };
              const w = (img.width / (img.height * (16 / 9))) * 100;
              const ml = (100 - w) / 2;
              slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
              i++;
            } else {
              let slide = ppt.addSlide();
              slide.background = { color: "282828" };
              const w = (img.width / (img.height * (16 / 9))) * 100;
              const ml = (100 - w*2) / 2;
              slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml + w}%` })
              i++;
            }
          } else {
            let slide = ppt.addSlide();
            slide.background = { color: "282828" };
            const w = (img.width / (img.height * (16 / 9))) * 100;
            const ml = (100 - w) / 2;
            slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
            i++;
          }
        }
      }

      return ppt.write()
    }
    const pageDouble = async (list,isFirstPageCover) => {
      let ppt = new PptxGenJS();
      for (let i = 0; i < list.length;) {
        const img: any = await this.getImageBase64([list[i]]);
        const img1: any = await this.getImageBase64([list[i + 1]]);
        if (img.height > img.width && img1.height > img1.width) {
          if (i == 0 && isFirstPageCover == true) {
            let slide = ppt.addSlide();
            slide.background = { color: "282828" };
            const w = (img.width / (img.height * (16 / 9))) * 100;
            const ml = (100 - w*2) / 2;
            slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml+w}%` })
            i++;
          } else {
            let slide = ppt.addSlide();
            slide.background = { color: "282828" };
            const w = (img.width / (img.height * (16 / 9))) * 100;
            const w1 = (img1.width / (img1.height * (16 / 9))) * 100;
            const ml = (100 - (w1 + w)) / 2;
            slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
            slide.addImage({ data: img1.dataURL, h: "100%", w: `${w1}%`, x: `${ml + w}%` })
            i++;
            i++;
          }
        } else if (img.height < img.width && img1.height < img1.width) {
          let slide = ppt.addSlide();
          slide.background = { color: "282828" };
          const w = (img.width / (img.height * (16 / 9))) * 100;
          const ml = (100 - w) / 2;
          slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          i++;
          let slide1 = ppt.addSlide();
          slide1.background = { color: "282828" };
          const w1 = (img1.width / (img1.height * (16 / 9))) * 100;
          const ml1 = (100 - w1) / 2;
          slide1.addImage({ data: img1.dataURL, h: "100%", w: `${w1}%`, x: `${ml1}%` })
          i++;
        } else if (img.height > img.width && img1.height < img1.width) {
          let slide = ppt.addSlide();
          slide.background = { color: "282828" };
          const w = (img.width / (img.height * (16 / 9))) * 100;
          const ml = (100 - w*2) / 2;
          slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          // if(i == 0){
          //   const ml = (100 - w*2) / 2;
          //   slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          // }else{
          //   const ml = (100 - w) / 2;
          //   slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
          // }
          i++;
          let slide1 = ppt.addSlide();
          slide1.background = { color: "282828" };
          const w1 = (img1.width / (img1.height * (16 / 9))) * 100;
          const ml1 = (100 - w1) / 2;
          slide1.addImage({ data: img1.dataURL, h: "100%", w: `${w1}%`, x: `${ml1}%` })
          i++;
        } else {
          if ((i + 1) == list.length) {
            if (img.height < img.width) {
              let slide = ppt.addSlide();
              slide.background = { color: "282828" };
              const w = (img.width / (img.height * (16 / 9))) * 100;
              const ml = (100 - w) / 2;
              slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
              i++;
            } else {
              let slide = ppt.addSlide();
              slide.background = { color: "282828" };
              const w = (img.width / (img.height * (16 / 9))) * 100;
              const ml = (100 - w*2) / 2;
              slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
              i++;
            }
          } else {
            let slide = ppt.addSlide();
            slide.background = { color: "282828" };
            const w = (img.width / (img.height * (16 / 9))) * 100;
            const ml = (100 - w) / 2;
            slide.addImage({ data: img.dataURL, h: "100%", w: `${w}%`, x: `${ml}%` })
            i++;
          }
        }
      }
      return ppt.write()
    }
    let bolb = null;
    if (page == "double" && pageOrder) bolb = await pageDouble(list, isFirstPageCover)
    else if (page == "double" && !pageOrder) bolb = await pageDouble_reverse(list, isFirstPageCover)
    else bolb = await pageOne(list)
    return bolb
  }
  async getImageBase64(arr) {
    if (arr.length == 1 && !arr[0]) {
      return { width: 0, height: 0 }
    } else if (arr.length == 1) {
      const image1 = await this.createImage(arr[0]);
      let canvas = document.createElement('canvas');
      canvas.width = image1.width;
      canvas.height = image1.height;
      let context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.drawImage(image1, 0, 0, image1.width, canvas.height);
      let dataURL = canvas.toDataURL("image/jpeg",0.92);
      return { width: canvas.width, height: canvas.height, dataURL: dataURL }
    } else if (arr.length == 2 && arr[0] && !arr[1]) {
      const image1 = await this.createImage(arr[0]);
      let canvas = document.createElement('canvas');
      canvas.width = image1.width;
      canvas.height = image1.height;
      let context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.drawImage(image1, 0, 0, image1.width, canvas.height);
      let dataURL = canvas.toDataURL("image/jpeg",0.92);
      return { width: canvas.width, height: canvas.height, dataURL: dataURL }
    } else if (arr.length == 2) {
      const image1 = await this.createImage(arr[0]);
      const image2 = await this.createImage(arr[1]);
      let canvas = document.createElement('canvas');
      canvas.width = image1.width + image2.width;
      canvas.height = (image1.height + image2.height) / 2;
      let context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.drawImage(image1, 0, 0, image1.width, canvas.height);
      context.drawImage(image2, image1.width, 0, image2.width, canvas.height);
      let dataURL = canvas.toDataURL("image/jpeg",0.92);
      return { width: canvas.width, height: canvas.height, dataURL: dataURL }
    } else {
      return null
    }
  }
  const createImage = async (imageUrl) => {
    if (!imageUrl) return { width: 0, height: 0 }
    return await createImageBitmap(await this.image.getImageBlob(imageUrl))
  }
}
