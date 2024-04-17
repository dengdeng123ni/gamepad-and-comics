import { Injectable } from '@angular/core';
import { ImageService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(public image:ImageService) {

  }
  getPageDouble = async (
    list: Array<{ id: string, src: string, width: number, height: number }>,
    option: { isFirstPageCover: boolean, pageOrder: boolean }
  ) => {
    let images = [];
    if (option.pageOrder) {
      images = await this.getPageDoubleNormal(list, option.isFirstPageCover);
    } else {
      images = await this.getPageDoubleReverse(list, option.isFirstPageCover);
    }

    return images
  }
  getPageDoubleReverse = async (list: Array<{ id: string, src: string, width: number, height: number }>, isFirstPageCover: boolean) => {
    const images = await this.getImagesWH(list)
    let arr = [];
    for (let i = 0; i < images.length;) {
      const img = images[i];
      const img1 = images[i + 1];
      if (img.height > img.width && img1 && img1.height > img1.width) {
        if (i == 0 && isFirstPageCover == true) {
          arr.push({
            page: {
              width: img.width * 2,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              id: img.id,
              img: img.src,
              width: img.width,
              height: img.height,
              index: i + 1
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
              id: img1.id,
              img: img1.src,
              width: img1.width,
              height: ((img.height + img1.height) / 2),
              index: i + 2
            }, {
              x: img1.width,
              y: 0,
              id: img.id,
              img: img.src,
              width: img.width,
              height: ((img.height + img1.height) / 2),
              index: i + 1
            }]
          })
          i++;
          i++;
        }
      } else if (img.height < img.width && img1 && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            id: img.id,
            img: img.src,
            width: img.width,
            height: img.height,
            index: i + 1
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
            id: img1.id,
            img: img1.src,
            width: img1.width,
            height: img1.height,
            index: i + 1
          }]
        })
        i++;
      } else if (img.height > img.width && img1 && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width * 2,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            id: img.id,
            img: img.src,
            width: img.width,
            height: img.height,
            index: i + 1
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
            id: img1.id,
            img: img1.src,
            width: img1.width,
            height: img1.height,
            index: i + 1
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
                id: img.id,
                img: img.src,
                width: img.width,
                height: img.height,
                index: i + 1
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
                id: img.id,
                img: img.src,
                width: img.width,
                height: img.height,
                index: i + 1
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
              id: img.id,
              img: img.src,
              width: img.width,
              height: img.height,
              index: i + 1
            }]
          })
          i++;
        }
      }
    }


    return arr
  }
  getPageDoubleNormal = async (list: Array<{ id: string, src: string, width: number, height: number }>, isFirstPageCover: boolean) => {
    const images = await this.getImagesWH(list)
    let arr = [];
    for (let i = 0; i < images.length;) {
      const img = images[i];
      const img1 = images[i + 1];
      if (img.height > img.width && img1 && img1.height > img1.width) {
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
              id: img.id,
              width: img.width,
              height: img.height,
              index: i + 1
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
              id: img.id,
              width: img.width,
              index: i + 1,
              height: ((img.height + img1.height) / 2)
            }, {
              x: img.width,
              y: 0,
              img: img1.src,
              id: img1.id,
              index: i + 2,
              width: img1.width,
              height: ((img.height + img1.height) / 2)
            }]
          })
          i++;
          i++;
        }
      } else if (img.height < img.width && img1 && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img.src,
            id: img.id,
            index: i + 1,
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
            id: img1.id,
            img: img1.src,
            index: i + 1,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else if (img.height > img.width && img1 && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width * 2,
            height: img.height
          },
          images: [{
            x: img.width,
            y: 0,
            id: img.id,
            img: img.src,
            index: i + 1,
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
            id: img1.id,
            img: img1.src,
            index: i + 1,
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
                id: img.id,
                img: img.src,
                index: i + 1,
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
                id: img.id,
                img: img.src,
                index: i + 1,
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
              id: img.id,
              img: img.src,
              index: i + 1,
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
  getImagesWH = async (list: Array<{ id: string, src: string, width: number, height: number }>) => {
    for (let i = 0; i < list.length; i++) {
      const x = list[i];
      if (x.width == 0 && x.height == 0) {
        try {
          const img = await this.loadImage(x.src)
          x.width = img.width;
          x.height = img.height;
        } catch (error) {

        }
      }
    }
    return list
  }
  loadImage = async (imageUrl:string): Promise<ImageBitmap> =>  await createImageBitmap(await this.image.getImageBlob(imageUrl))
  async loadImages(list: Array<string>) {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      const x = list[i];
      try {
        const img = await this.loadImage(x);
        arr.push(img)
      } catch (error) {
        arr.push(null)
      }
    }
    return arr
  }
}
