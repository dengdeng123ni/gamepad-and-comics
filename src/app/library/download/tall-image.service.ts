import { Injectable } from '@angular/core';
import { ImageService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class TallImageService {

  constructor(public image: ImageService) {

  }

  async download(imagePaths, direction) {
    let blob
    if (direction == 'down') blob = await this.down(imagePaths)
    if (direction == 'up') blob = await this.up(imagePaths)
    if (direction == 'right') blob = await this.right(imagePaths)
    if (direction == 'left') blob = await this.left(imagePaths)
    return blob
  }
  // 从上往下 长图片
  async down(imagePaths) {
    console.log(imagePaths);

    let images = [];
    let totalWidth = 0;
    let totalHeight = 0;

    // 加载所有图片
    const loadPromises = imagePaths.map(async (path) => {
      return await createImageBitmap(await this.image.getImageBlob(path));
    });

    // 当所有图片加载完成后进行拼接
    return await Promise.all(loadPromises).then(e => {
      // 计算 canvas 的宽度为所有图片宽度的平均值

      e.forEach(img => {
        images.push(img);
        totalWidth += img.width;
        totalHeight += img.height;
      })

      const canvasWidth = totalWidth / images.length;
      const canvasHeight = totalHeight;

      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      // 将每张图片依次绘制在 canvas 上
      let currentY = 0;
      images.forEach(img => {
        const offsetX = (canvasWidth - img.width) / 2; // 横向居中
        ctx.drawImage(img, offsetX, currentY);
        currentY += img.height; // 更新 y 坐标以绘制下一张图片
      });

      // 导出拼接后的图片
      const dataURL = canvas.toDataURL('image/jpeg', 0.83);

      const blob = this.base64ToBlob(dataURL, "jpeg");


      return blob
    });
  }
  // 从下往上 长图片
  async up(imagePaths) {
    console.log(imagePaths);

    let images = [];
    let totalWidth = 0;
    let totalHeight = 0;

    // 加载所有图片
    const loadPromises = imagePaths.map(async (path) => {
      return await createImageBitmap(await this.image.getImageBlob(path));
    });

    // 当所有图片加载完成后进行拼接
    return await Promise.all(loadPromises).then(e => {
      // 计算 canvas 的宽度为所有图片宽度的平均值

      e.forEach(img => {
        images.push(img);
        totalWidth += img.width;
        totalHeight += img.height;
      })

      const canvasWidth = totalWidth / images.length;
      const canvasHeight = totalHeight;

      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      // 将每张图片依次绘制在 canvas 上
      let currentY = totalHeight; // 当前 y 坐标从总高度开始
      images.forEach(img => {
        currentY -= img.height; // 更新 y 坐标以绘制下一张图片（从下往上）
        ctx.drawImage(img, 0, currentY); // 绘制图片，x 坐标为 0
      });

      // 导出拼接后的图片
      const dataURL = canvas.toDataURL('image/jpeg', 0.83);

      const blob = this.base64ToBlob(dataURL, "jpeg");


      return blob
    });
  }
  // 从左到右 长图片
  async right(imagePaths) {
    console.log(imagePaths);

    let images = [];
    let totalWidth = 0;
    let totalHeight = 0;

    // 加载所有图片
    const loadPromises = imagePaths.map(async (path) => {
      return await createImageBitmap(await this.image.getImageBlob(path));
    });

    // 当所有图片加载完成后进行拼接
    return await Promise.all(loadPromises).then(e => {
      // 计算 canvas 的宽度为所有图片宽度的平均值

      e.forEach(img => {
        images.push(img);
        totalWidth += img.width;
        totalHeight += img.height;
      })

      const canvasWidth = totalWidth;
      const canvasHeight = totalHeight / images.length;

      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      // 将每张图片依次绘制在 canvas 上
      let currentX = 0; // 当前 x 坐标
      images.forEach(img => {
        ctx.drawImage(img, currentX, 0); // 绘制图片，y 坐标为 0
        currentX += img.width; // 更新 x 坐标以绘制下一张图片
      });

      // 导出拼接后的图片
      const dataURL = canvas.toDataURL('image/jpeg', 0.83);

      const blob = this.base64ToBlob(dataURL, "jpeg");


      return blob
    });
  }
  // 从右到左 长图片
  async left(imagePaths) {
    console.log(imagePaths);

    let images = [];
    let totalWidth = 0;
    let totalHeight = 0;

    // 加载所有图片
    const loadPromises = imagePaths.map(async (path) => {
      return await createImageBitmap(await this.image.getImageBlob(path));
    });

    // 当所有图片加载完成后进行拼接
    return await Promise.all(loadPromises).then(e => {
      // 计算 canvas 的宽度为所有图片宽度的平均值

      e.forEach(img => {
        images.push(img);
        totalWidth += img.width;
        totalHeight += img.height;
      })

      const canvasWidth = totalWidth;
      const canvasHeight = totalHeight / images.length;

      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      // 将每张图片依次绘制在 canvas 上
      let currentX = totalWidth; // 当前 x 坐标从总宽度开始
      images.forEach(img => {
        currentX -= img.width; // 更新 x 坐标以绘制下一张图片（从右往左）
        ctx.drawImage(img, currentX, 0); // 绘制图片，y 坐标为 0
      });

      // 导出拼接后的图片
      const dataURL = canvas.toDataURL('image/jpeg', 0.83);

      const blob = this.base64ToBlob(dataURL, "jpeg");


      return blob
    });
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
}
