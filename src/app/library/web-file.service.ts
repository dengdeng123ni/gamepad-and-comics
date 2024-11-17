import { Injectable } from '@angular/core';
import { DbControllerService, DownloadService, I18nService } from './public-api';

@Injectable({
  providedIn: 'root'
})
export class WebFileService {

  dirHandle = null;
  paths = [];

  list = [];
  logs = [

  ];
  is_download_free=false;
  constructor(public DbController: DbControllerService,
    public I18n:I18nService,
    public download: DownloadService,) {
  }


  async open() {
    try {
      this.dirHandle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
      return true
    } catch (error) {
      return false
    }
  }
  async getPaths() {
    let files_arr = [];
    const handleDirectoryEntry = async (dirHandle: any, out: { [x: string]: {}; }, path: any) => {
      if (dirHandle.kind === "directory") {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file") {
            const arr = entry.name.split(".");
            if (arr.length == 2 && ["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(arr[1])) {
              out[entry.name] = { dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name };
              this.paths.push({ dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
            }
          }
          if (entry.kind === "directory") {
            const newOut = out[entry.name] = {};
            await handleDirectoryEntry(entry, newOut, `${path}/${entry.name}`);
          }
        }
      }
      if (dirHandle.kind === "file") {
        const entry = dirHandle;
        const arr = entry.name.split(".");
        if (arr.length == 2 && ["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(arr[1])) return
        out[entry.name] = { dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name };
        this.paths.push({ dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
      }
    }
    await handleDirectoryEntry(this.dirHandle, {}, '')

  }
  async post(path, blob): Promise<boolean> {
    this.addlog(`写入文件中 ${path}`)
    try {
      const obj = this.paths.find(x => x.path == path)
      if (!obj) {
        const arr = path.split("/")


        const createDirHandle = async (dirHandle, path_arr, index) => {


          if ((path_arr.length - 1) == index) {
            for await (const it of dirHandle.values()) {
              if (it.name == path_arr[index]) {
                return null;
              }
            }
            const res = await dirHandle.getFileHandle(path_arr[index], {
              create: true,
            });
            return res
          } else {

            const res = await dirHandle.getDirectoryHandle(path_arr[index], {
              create: true,
            });
            index++;
            return await createDirHandle(res, path_arr, index)
          }
        }
        const dir = await createDirHandle(this.dirHandle, arr, 0)
        if (dir) {
          const writable = await dir.createWritable();
          await writable.write(blob);
          await writable.close();
          this.paths.push({ dirHandle: dir, path: path.substring(1), name: dir.name })
        }
      }
      this.addlog(`写入文件成功 ${path}`)
      return true
    } catch (error) {
      return false

    }

  }

  async get(path): Promise<Blob> {

    return new Blob([])
  }

  async del(path): Promise<boolean> {
    return true
  }
  async downloadComicsAll(option: {
    list: any,
    type: Array<string>,
    pageOrder: boolean,
    isFirstPageCover: boolean,
    page: string,
    downloadChapterAtrer?: Function,
    imageChange?: Function
  }) {
    this.list=[];
    if (!this.dirHandle) await this.open();

    this.is_download_free=false;
    this.addlog("加载日志")
    this.list = option.list;
    this.list.forEach(x=>{
      x.download_status="待下载";
    })
    for (let index = 0; index < option.list.length; index++) {
      const x = option.list[index];
      this.list[index].download_status='下载中';
      for (let index2 = 0; index2 < option.type.length; index2++) {
        await this.downloadComics(x.id, {
          type: option.type[index2],
          pageOrder: option.pageOrder,
          isFirstPageCover: option.isFirstPageCover,
          page: option.page,
          downloadChapterAtrer: option.downloadChapterAtrer,
          imageChange: option.imageChange
        })
      }
      this.list[index].download_status='下载完成';
    }
    this.is_download_free=true;
    this.dirHandle=null;
    this.addlog("下载完成")

  }
  addlog(text) {
    this.logs.unshift(text);
  }
  async downloadComics(comics_id, option?: {
    chapters_ids?: Array<any>,
    type?: string,

    pageOrder: boolean,
    isFirstPageCover: boolean,
    page: string,
    downloadChapterAtrer?: Function,
    imageChange?: Function
  }) {

    if (!this.dirHandle) await this.open();
    const 加载中 = await this.I18n.getTranslatedText('加载中')
    const 加载成功 = await this.I18n.getTranslatedText('加载成功')
    const 图片 = await this.I18n.getTranslatedText('图片')
    const 第 = await this.I18n.getTranslatedText('第')
    const 日漫 = await this.I18n.getTranslatedText('日漫')
    const 双页 = await this.I18n.getTranslatedText('双页')
    const 单页 = await this.I18n.getTranslatedText('单页')
    const 生成文件中 = await this.I18n.getTranslatedText('生成文件中')
    const 生成文件成功 = await this.I18n.getTranslatedText('生成文件成功')

    const toTitle = (title) => {
      return title.replace(/[\r\n]/g, "").replace(":", "").replace("|", "").replace(/  +/g, ' ').replace(/[\'\"\\\/\b\f\n\r\t]/g, '').replace(/[\@\#\$\%\^\&\*\{\}\:\"\<\>\?]/).trim()
    }
    this.addlog(`${加载中} ${comics_id}`)
    let { chapters, title, option: config } = await this.DbController.getDetail(comics_id)
    this.addlog(`${加载成功} ${title}`)
    if (option?.chapters_ids?.length) chapters = chapters.filetr(x => option.chapters_ids.includes(x.id))
    const is_offprint= chapters.length==1?true:false;
    for (let index = 0; index < chapters.length; index++) {
      const x = chapters[index];
      this.addlog(`${加载中} ${x.title}`)
      const pages = await this.DbController.getPages(x.id);
      this.addlog(`${加载成功} ${x.title}`)
      for (let j = 0; j < pages.length; j++) {
        this.addlog(`${加载中} ${x.title} ${第} ${j} ${图片}`)
        await this.DbController.getImage(pages[j].src)
        this.addlog(`${加载成功} ${x.title} ${第} ${j} ${图片}`)
      }

      // this.addlog(`加载中 ${comics_id}`)
      // await Promise.all(pages.map(x => this.DbController.getImage(x.src)))
      if (option?.type) {
        if (option.type == "JPG") {
          if (option.page == "double") {
            const blobs = await this.download.ImageToTypeBlob({ type: option.type, name: toTitle(x.title), images: pages.map((x: { src: any; }) => x.src), pageOrder: option.pageOrder, isFirstPageCover: option.isFirstPageCover, page: option.page }) as any
            for (let index = 0; index < blobs.length; index++) {
              let blob = blobs[index]
              if (option.imageChange) blob = await option.imageChange(blob);
              if (is_offprint) {
                await this.post(`${config.source}[${双页}]${option.pageOrder ? "" : `[${日漫}]`}/${toTitle(title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
              } else {
                await this.post(`${config.source}[${双页}]${option.pageOrder ? "" : `[${日漫}]`}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
              }
            }
          } else {
            const downloadImage = async (x2, index) => {
              let blob = await this.DbController.getImage(x2.src)

              if (option.imageChange) blob = await option.imageChange(blob);
              if (blob.size > 500) {
                if (is_offprint) {
                  await this.post(`${config.source}/${toTitle(title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                } else {
                  await this.post(`${config.source}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                }
              } else {
                const blob = await this.DbController.getImage(x2.src)
                if (blob.size > 500) {
                  if (is_offprint) {
                    await this.post(`${config.source}/${toTitle(title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                  } else {
                    await this.post(`${config.source}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                  }
                }
              }
            }
            await Promise.all(pages.map((x2, index) => downloadImage(x2, index)))

          }
          if (option.downloadChapterAtrer) option.downloadChapterAtrer(x)
          continue;
        }
        this.addlog(`${生成文件中} ${option.type}`)
        let blob = await this.download.ImageToTypeBlob({ type: option.type, name: toTitle(x.title), images: pages.map((x: { src: any; }) => x.src), pageOrder: option.pageOrder, isFirstPageCover: option.isFirstPageCover, page: option.page }) as any
        this.addlog(`${生成文件成功} ${option.type}`)
        let suffix_name = blob.type.split("/").at(-1);
        if (option.type == "PDF") {

        }
        if (option.type == "PPT") {
          suffix_name = `pptx`;
        }
        if (option.type == "ZIP") {
        }
        if (option.type == "EPUB") {
          suffix_name = `epub`;
        }
        if (is_offprint) {
          await this.post(`${config.source}[${suffix_name}][${option.page == "double" ? `${双页}` : `${单页}`}]${option.pageOrder ? "" : `[${日漫}]`}/${toTitle(title)}.${suffix_name}`, blob)
        } else {
          await this.post(`${config.source}[${suffix_name}][${option.page == "double" ? `${双页}` : `${单页}`}]${option.pageOrder ? "" : `[${日漫}]`}/${toTitle(title)}/${toTitle(x.title)}.${suffix_name}`, blob)
        }
        if (option.downloadChapterAtrer) option.downloadChapterAtrer(x)
      }



    }
  }



}
