import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor() {

  }

  createImage = (src) => {
    if (!src) {
      return {
        width: 0,
        height: 0
      }
    }

    return new Promise((r, j) => {
      var img = new Image();
      img.src = src;
      img.onload = function () {
        r(img)
        j(img)
      };
    })
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
      const img: any = await this.createImage(list[i]);
      const img1: any = await this.createImage(list[i + 1]);
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
              height: img.height,
              index:i+1
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
              height: ((img.height + img1.height) / 2),
              index:i+2
            }, {
              x: img1.width,
              y: 0,
              img: img.src,
              width: img.width,
              height: ((img.height + img1.height) / 2),
              index:i+1
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
            height: img.height,
            index:i+1
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
            height: img1.height,
            index:i+1
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
            height: img.height,
            index:i+1
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
            height: img1.height,
            index:i+1
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
                height: img.height,
                index:i+1
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
                height: img.height,
                index:i+1
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
              height: img.height,
              index:i+1
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
      const img: any = await this.createImage(list[i]);
      const img1: any = await this.createImage(list[i + 1]);
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
