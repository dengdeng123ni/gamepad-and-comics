import { Injectable } from '@angular/core';
import { ZipService } from './zip.service';
let blobs = [];
let WIDTH = 1920;
let HEIGHT = 1080;
let backdropClass = "#ffffff";
let fps = 30;

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
      fps?,
    }) {
    blobs = await this.Zip.createZip(list
      , {
        isFirstPageCover,
        page,
        pageOrder
      }) as any;
   if(otpion.WIDTH) WIDTH=otpion.WIDTH;
   if(otpion.HEIGHT) HEIGHT=otpion.HEIGHT;
   if(otpion.backdropClass) backdropClass=otpion.backdropClass;
   if(otpion.fps) fps=otpion.fps;
   const com = await this.start();
   const srcBlob = await new Response(com?.output()).blob();
   return srcBlob
  }

  // 视频宽度
  // 视频长度
  // 背景颜色
  // 一张图片的持续时间


  async start() {



    const spr = new OffscreenSprite(new CountdownClip(blobs.length * fps));

    const com = new Combinator({ width: WIDTH, height: HEIGHT, fps: 1 / fps });
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

    const index = time / (fps * 1000000);
    console.log(index);

    if (index == blobs.length) return { state: 'done' };

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

