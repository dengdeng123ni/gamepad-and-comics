// @ts-nocheck
import { Injectable } from '@angular/core';
import { ImageService } from '../public-api';
declare const JSZip: any;
declare const saveAs: any;
@Injectable({
  providedIn: 'root'
})
export class ZipService {


  constructor(public image:ImageService) { }
  async createZip(
    list: Array<string>, {
    isFirstPageCover = false,
    page = "double",
    pageOrder = false
  }) {
    if(page == "one"){
      let images = [];
      for (let j = 0; j < list.length; j++) {
        const src = list[j];
        const blob=await this.image.getImageBlob(src)
        images.push(blob)
      }
      return images
    }
    let arr = [];
    if (pageOrder) arr = await this.pageDouble(list, isFirstPageCover)
    else arr = await this.pageDouble_reverse(list, isFirstPageCover)
    let images = [];
    for (let index = 0; index < arr.length; index++) {
      const x = arr[index];
      let canvas = document.createElement('canvas');
      canvas.width = x.page.width;
      canvas.height = x.page.height;
      let context = canvas.getContext('2d');
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgb(255,255,255)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      if (x.images.length == 1) {
        var img = await this.createImage(x.images[0].img) as any;
        context.drawImage(img, x.images[0].x, x.images[0].y, x.images[0].width, x.images[0].height);
      } else if (x.images.length == 2) {
        var img = await this.createImage(x.images[0].img) as any;
        var img1 = await this.createImage(x.images[1].img) as any;
        context.drawImage(img, x.images[0].x, x.images[0].y, x.images[0].width, x.images[0].height);
        context.drawImage(img1, x.images[1].x, x.images[1].y, x.images[1].width, x.images[1].height);
      }
      let dataURL = canvas.toDataURL("image/jpeg",0.92);
      const blob = this.base64ToBlob(dataURL, "jpeg");
      images.push(blob);
    }
    return images
  }
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
  async create(name: string, arr1: Array<{ path: string, src: string }>) {
    const arr = await this.getImageBlob(arr1);
    var zip = new JSZip();
    arr.forEach(x => {
      zip.file(x.path, x.blob)
    })
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, name);
    })
  }
  async getImageBlob(images: Array<{ path: string, src: string }>) {
    let arr = [];
    let paths = [];
    for (let i = 0; i < images.length; i++) {
      const x = images[i];
      const blob = await this.image.getImageBlob(imageUrl)
      const srcs = blob.type.split("/");
      const path = `${x.path}.${srcs.at(-1)}`;
      arr.push({ path: `${path}`, blob: blob })
      paths.push(path);
    }
    return arr
  }
  createImage = async (imageUrl) => {
    if (!imageUrl) return { width: 0, height: 0 }
    return await createImageBitmap(await this.image.getImageBlob(imageUrl))
  }
  compressImage = async (src) => {
    if (!src) {
      return {
        width: 0,
        height: 0
      }
    }
    const image1 = await this.createImage(src) as any;
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
    let dataURL = canvas.toDataURL("image/jpeg");
    return new Promise((r, j) => {
      var img = new Image();
      img.src = dataURL;
      img.onload = function () {
        r(img)
        j(img)
      };
    })
  }
  pageDouble_reverse = async (list, isFirstPageCover) => {
    let arr = [];
    for (let i = 0; i < list.length;) {
      const img: any = await this.compressImage(list[i]);
      const img1: any = await this.compressImage(list[i + 1]);
      if (img.height > img.width && img1.height > img1.width) {
        if (i == 0 && isFirstPageCover == true) {
          arr.push({
            page: {
              width: img.width * 2,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        } else {
          arr.push({
            page: {
              width: img.width + img1.width,
              height: ((img.height + img1.height) / 2)
            },
            images: [{
              x: 0,
              y: 0,
              img: img1.src,
              width: img1.width,
              height: ((img.height + img1.height) / 2)
            }, {
              x: img1.width,
              y: 0,
              img: img.src,
              width: img.width,
              height: ((img.height + img1.height) / 2)
            }]
          })
          i++;
          i++;
        }
      } else if (img.height < img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else if (img.height > img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width * 2,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else {
        if ((i + 1) == list.length) {
          if (img.height < img.width) {
            arr.push({
              page: {
                width: img.width,
                height: img.height
              },
              images: [{
                x: 0,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          } else {
            arr.push({
              page: {
                width: img.width * 2,
                height: img.height
              },
              images: [{
                x: img.width,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          }
        } else {
          arr.push({
            page: {
              width: img.width,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        }
      }
    }
    return arr
  }
  pageDouble = async (list, isFirstPageCover) => {
    let arr = [];
    for (let i = 0; i < list.length;) {
      const img: any = await this.compressImage(list[i]);
      const img1: any = await this.compressImage(list[i + 1]);
      if (img.height > img.width && img1.height > img1.width) {
        if (i == 0 && isFirstPageCover == true) {
          arr.push({
            page: {
              width: img.width * 2,
              height: img.height
            },
            images: [{
              x: img.width,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        } else {
          arr.push({
            page: {
              width: img.width + img1.width,
              height: ((img.height + img1.height) / 2)
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: ((img.height + img1.height) / 2)
            }, {
              x: img.width,
              y: 0,
              img: img1.src,
              width: img1.width,
              height: ((img.height + img1.height) / 2)
            }]
          })
          i++;
          i++;
        }
      } else if (img.height < img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else if (img.height > img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width * 2,
            height: img.height
          },
          images: [{
            x: img.width,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else {
        if ((i + 1) == list.length) {
          if (img.height < img.width) {
            arr.push({
              page: {
                width: img.width,
                height: img.height
              },
              images: [{
                x: 0,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          } else {
            arr.push({
              page: {
                width: img.width * 2,
                height: img.height
              },
              images: [{
                x: 0,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          }
        } else {
          arr.push({
            page: {
              width: img.width,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        }
      }
    }
    return arr
  }
}
