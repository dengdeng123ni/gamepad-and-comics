import { Component } from '@angular/core';
import { ImageService } from 'src/app/library/public-api';

@Component({
  selector: 'app-image-to',
  templateUrl: './image-to.component.html',
  styleUrl: './image-to.component.scss'
})
export class ImageToComponent {
  list = [
    {
      "id": "100016",
      "title": "COMIC Kuriberon DUMA 2023-12 Vol.55\n        [Chinese]",
      "cover": "http://localhost:7700/hanime1/comics/100016",
      "origin": "hanime1",
      "last_read_date": 1727768911114,
      "subTitle": "0%",
      "selected": true
    },
    {
      "id": "100778",
      "title": "[Satou Kuuki]\n        Shino Channel\n        ~Kareshi Mochi Bungaku JK Uwakiroku~ [Chinese] [無邪気漢化組] [Digital]",
      "cover": "http://localhost:7700/hanime1/comics/100778",
      "origin": "hanime1",
      "last_read_date": 1724531105175,
      "subTitle": "0%",
      "selected": true
    },
    {
      "id": "101989",
      "title": "[Jack to Nicholson (NoriPachi)]\n        Nikubenki Ganbou JK. + Watashi ga Rogin o Kasegimasu.\n        (Sousou no Frieren) [Chinese] [Digital]",
      "cover": "http://localhost:7700/hanime1/comics/101989",
      "origin": "hanime1",
      "last_read_date": 1728495820380,
      "subTitle": "0%",
      "selected": true
    },
    {
      "id": "103129",
      "title": "[c-kyuu] Gibo-san wa boku no mono 1-6 [Chinese] [葱鱼个人汉化]",
      "cover": "http://localhost:7700/hanime1/comics/103129",
      "origin": "hanime1",
      "last_read_date": 1728491324671,
      "subTitle": "0%",
      "selected": true
    },
    {
      "id": "103654",
      "title": "[Enokido]\n        Seiyoku Tsuyo Tsuyo\n        [Chinese] [Decensored] [Digital] [guyxyz個人重嵌]",
      "cover": "http://localhost:7700/hanime1/comics/103654",
      "origin": "hanime1",
      "last_read_date": 1727115768446,
      "subTitle": "0%",
      "selected": true
    },
    {
      "id": "103757",
      "title": "[ratatatat74]\n        Blacked Coach 媚黑教练\n        [Chinese][Colorized][挽歌个人汉化]",
      "cover": "http://localhost:7700/hanime1/comics/103757",
      "origin": "hanime1",
      "last_read_date": 1728493148173,
      "subTitle": "0%",
      "selected": true
    },
    {
      "id": "1038",
      "title": "[ratatatat74]\n        072021 reward白人版\n        [Chinese] [流木个人汉化]",
      "cover": "http://localhost:7700/hanime1/comics/1038",
      "origin": "hanime1",
      "last_read_date": 1723913655938,
      "subTitle": "0%",
      "selected": true
    },
    {
      "id": "104567",
      "title": "[緋月アキラ]\n        ノイパちゃんはアブナイ！\n        [中国翻译]",
      "cover": "http://localhost:7700/hanime1/comics/104567",
      "origin": "hanime1",
      "last_read_date": 1728492822689,
      "subTitle": "0%",
      "selected": true
    }
  ];

  cover = '';
  toCover = '';

  value=0;
  constructor(public image: ImageService) {
    this.cover = this.list[0].cover;
    this.init();
  }
  async init() {
    this.toCover = await this.to(this.cover)
    console.log(this.toCover);

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
    const saturateMatrix = [
      0.213, 0.715, 0.072, 0, 0,
      0.213, 0.715, 0.072, 0, 0,
      0.213, 0.715, 0.072, 0, 0,
      0, 0, 0, 1, 0
    ];
    const newImageData = this.applyColorMatrix(imageData, saturateMatrix);
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
  on(e) {

  }


}
