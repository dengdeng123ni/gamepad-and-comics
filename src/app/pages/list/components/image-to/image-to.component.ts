import { Component, Inject } from '@angular/core';
import { ImageService, WebFileService } from 'src/app/library/public-api';
import { compress } from 'image-conversion';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-to',
  templateUrl: './image-to.component.html',
  styleUrl: './image-to.component.scss'
})
export class ImageToComponent {
  option = {
    size: null,
    width: null,
    quality: 0.92,
    type: 'png'
  }
  is_compress=false;
  list = [

];
  saturateMatrix = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0
  ];
  cover = '';
  toCover = '';
  arr = [
    {
      name: "灰度",
      value: [
        0.213, 0.715, 0.072, 0, 0,
        0.213, 0.715, 0.072, 0, 0,
        0.213, 0.715, 0.072, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    {
      name: "棕褐色",
      value: [
        0.393, 0.769, 0.189, 0, 0,
        0.349, 0.686, 0.168, 0, 0,
        0.272, 0.534, 0.131, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    {
      name: "布朗尼",
      value: [
        0.627, 0.320, 0.075, 0, 0,
        0.299, 0.587, 0.114, 0, 0,
        0.239, 0.469, 0.091, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    {
      name: "反转颜色",
      value: [
        -1, 0, 0, 0, 1,
        0, -1, 0, 0, 1,
        0, 0, -1, 0, 1,
        0, 0, 0, 1, 0
      ]
    },

    {
      name: "柯达胶卷",
      value: [
        1.15, 0.05, 0.05, 0, 0,
        0.05, 1.10, 0.05, 0, 0,
        0.05, 0.05, 1.10, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
    {
      name: "宝丽来",
      value: [
        0.3588, 0.7044, 0.1368, 0, 0,
        0.2990, 0.5870, 0.1140, 0, 0,
        0.2392, 0.4696, 0.0912, 0, 0,
        0, 0, 0, 1, 0
      ]
    },
  ]

  value = 0;
  saturateMatrixChange = () => {
    document.querySelector("#vvvv feColorMatrix").setAttribute("values", this.saturateMatrix.toString())
  }
  constructor(public image: ImageService, public WebFile: WebFileService,

    @Inject(MAT_DIALOG_DATA) public _data,
  ) {
    this.list=_data;
    this.cover = this.list[0].cover;
    this.init();



  }
  async init() {
    this.toCover = await this.to(this.cover)
  }
  async to(_src) {
    let src = '';
    const bolb = await this.image.getImageBlob(_src);
    const image = await createImageBitmap(bolb);
    let canvas = document.createElement('canvas');
    const width = image.width;
    const height = image.height;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = this.applyColorMatrix(imageData, this.saturateMatrix);
    context.putImageData(newImageData, 0, 0);
    let dataURL = canvas.toDataURL("image/jpeg");
    return dataURL
  }

  applyColorMatrix(imageData, matrix) {
    const data = imageData.data;  // 图像数据的像素数组
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];      // Red
      const g = data[i + 1];  // Green
      const b = data[i + 2];  // Blue
      const a = data[i + 3];  // Alpha

      // 应用颜色矩阵
      const newR = matrix[0] * r + matrix[1] * g + matrix[2] * b + matrix[3] * a + matrix[4];
      const newG = matrix[5] * r + matrix[6] * g + matrix[7] * b + matrix[8] * a + matrix[9];
      const newB = matrix[10] * r + matrix[11] * g + matrix[12] * b + matrix[13] * a + matrix[14];
      const newA = matrix[15] * r + matrix[16] * g + matrix[17] * b + matrix[18] * a + matrix[19];

      // 更新图像数据
      data[i] = Math.min(255, Math.max(0, newR));  // 保证在 [0, 255] 范围内
      data[i + 1] = Math.min(255, Math.max(0, newG));
      data[i + 2] = Math.min(255, Math.max(0, newB));
      data[i + 3] = Math.min(255, Math.max(0, newA));
    }
    return imageData;
  }
  RGBToGrayScale(red, green, blue) {
    //return red * 0.2126 + green * 0.7152 + blue * 0.0722;
    return (red * 6966 + green * 23436 + blue * 2366) >> 15;
  }
  async imageMatrix(blob, matrix) {
    const image = await createImageBitmap(blob);
    let canvas = document.createElement('canvas');
    const width = image.width;
    const height = image.height;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = this.applyColorMatrix(imageData, matrix);
    context.putImageData(newImageData, 0, 0);
    let dataURL = canvas.toDataURL("image/jpeg");
    return this.base64ToBlob(dataURL)
  }
  imageCcompress = async (blob, option) => {
    return await compress(blob, option)
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
  on(e) {
    this.saturateMatrix = e.value;
  }

  async download() {
    for (let index = 0; index < this.list.length; index++) {
      const id = this.list[index].id;
      await this.WebFile.downloadComics(id, {
        type: 'JPG',
        isFirstPageCover: false,
        pageOrder: false,
        page: 'one',
        downloadChapterAtrer: x => {

        },
        imageChange: async blob => {

          let blob2 = await this.imageMatrix(blob, this.saturateMatrix);
          let obj = {
            mimeType: `image/${this.option.type}`,
            size: this.option.size ?? undefined,
            quality: this.option.size ? undefined : this.option.quality,
            width: this.option.width ?? undefined
          };
          if(this.is_compress)  blob2 = await compress(blob2, obj)
          return blob2

        }
      })

    }


  }




}
