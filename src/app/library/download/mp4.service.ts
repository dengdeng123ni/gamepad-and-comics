import { Injectable } from '@angular/core';
import { ZipService } from './zip.service';
let blobs = [];
let blobs_index=-1;
let WIDTH = 1920;
let HEIGHT = 1080;
let backdropClass = "#ffffff";
let image_duration = 30;
let image_count=1;

@Injectable({
  providedIn: 'root'
})
export class Mp4Service {

  constructor(public Zip: ZipService) {

  }
  async init() {
    const com = await this.start();
    const srcBlob = await new Response(com?.output()).blob();
    const url = URL.createObjectURL(srcBlob)
    const a = document.createElement('a');

    a.href = url;
    a.download = 'output.mp4';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }

  async createMp4(
    list: Array<string>
    , {
      isFirstPageCover = false,
      page = "double",
      pageOrder = false
    },
    otpion?: {
      WIDTH?,
      HEIGHT?,
      backdropClass?,
      image_duration?,
      image_count?,
      is_insert_blank_page?
    }) {
    blobs = await this.Zip.createZip(list
      , {
        isFirstPageCover,
        page,
        pageOrder
      }) as any;

    const createWhiteImage = async (blob) => {
      const img = await createImageBitmap(blob)
      return new Promise((r, j) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        // 填充白色
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, img.width, img.height);

        // 转换为 Blob
        canvas.toBlob((blob) => {
          if (blob) {
            r(blob);
          }
        }, "image/png");
      });
    }
    if(otpion.is_insert_blank_page){
      const blob= await createWhiteImage(blobs[blobs.length-1])
      blobs.push(blob)
    }


    if (otpion.WIDTH) WIDTH = otpion.WIDTH;
    if (otpion.HEIGHT) HEIGHT = otpion.HEIGHT;
    if (otpion.backdropClass) backdropClass = otpion.backdropClass;
    if (otpion.image_duration) image_duration = otpion.image_duration;
    if (otpion.image_count) image_count = otpion.image_count;
    blobs_index=-1;
    const com = await this.start();
    const srcBlob = await new Response(com?.output()).blob();
    return srcBlob
  }



  // 视频宽度
  // 视频长度
  // 背景颜色
  // 一张图片的持续时间


  async start() {



    const spr = new OffscreenSprite(new CountdownClip(blobs.length * image_duration));

    const com = new Combinator({ width: WIDTH, height: HEIGHT, fps: image_count/image_duration });
    await com.addSprite(spr, { main: true });

    return com;
  }
}

import { Combinator, OffscreenSprite, IClip } from '@webav/av-cliper';




class CountdownClip implements IClip {
  #cvsEl;
  #ctx;
  #duration;

  ready;

  get meta() {
    return {
      width: this.#cvsEl.width,
      height: this.#cvsEl.height,
      duration: this.#duration * 1e6,
    };
  }

  constructor(duration: number) {
    this.#duration = duration;
    this.#cvsEl = document.createElement('canvas');
    this.#cvsEl.width = WIDTH;
    this.#cvsEl.height = HEIGHT;

    this.ready = Promise.resolve({
      width: WIDTH,
      height: HEIGHT,
      // 单位 微秒
      duration: duration * 1e6,
    });

    this.#ctx = this.#cvsEl.getContext('2d')!;
  }

  tick = async (time: number): Promise<{
    video?: VideoFrame;
    state: 'success' | 'done';
  }> => {
    // if (time > 1e6 * 10) return { state: 'done' };

    let index = (time) / (image_duration* 1000000);
    index=Math.floor(index)


    if (index == blobs.length) return { state: 'done' };
    if(blobs_index==index){

    }else{
      const blob = blobs[index];
      const img = await createImageBitmap(blob)
      this.#ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.#ctx.rect(0, 0, WIDTH, HEIGHT);

      this.#ctx.fillStyle = backdropClass;
      this.#ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (img.width * (HEIGHT / img.height) <= WIDTH) {
        this.#ctx.drawImage(img, (WIDTH - ((img.width * (HEIGHT / img.height)))) / 2, 0, img.width * (HEIGHT / img.height), HEIGHT);
      } else {
        this.#ctx.drawImage(img, 0, (HEIGHT - ((img.height * (WIDTH / img.width)))) / 2, WIDTH, img.height * (WIDTH / img.width));
      }
      blobs_index=index;
    }




    return {
      state: 'success',
      video: new VideoFrame(this.#cvsEl, {
        timestamp: time,
      }),
    };
  }

  async clone() {
    return new CountdownClip(this.#duration) as this;
  }

  destroy() {
    this.#cvsEl.remove();
  }
}

