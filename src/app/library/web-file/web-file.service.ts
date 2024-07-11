import { Injectable } from '@angular/core';
import { DbControllerService, DownloadService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class WebFileService {

  dirHandle = null;
  paths = [];
  constructor(public DbController: DbControllerService, public download: DownloadService,) {
  }


  async open() {
    this.dirHandle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
    // await this.getPaths();
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

  async downloadComics(comics_id, option?: {
    chapters_ids?: Array<any>,
    type?: string,
    pageOrder: boolean,
    isFirstPageCover: boolean,
    page: string,
    downloadChapterAtrer?: Function
  }) {

    if (!this.dirHandle) await this.open();

    const toTitle = (title) => {
      return title.replace(/[\r\n]/g, "").replace(":", "").replace("|", "").replace(/  +/g, ' ').replace(/[\'\"\\\/\b\f\n\r\t]/g, '').replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/).trim()
    }
    let { chapters, title, option: config } = await this.DbController.getDetail(comics_id)

    if (option?.chapters_ids?.length) chapters = chapters.filetr(x => option.chapters_ids.includes(x.id))
    for (let index = 0; index < chapters.length; index++) {
      const x = chapters[index];
      const pages = await this.DbController.getPages(x.id);
      await Promise.all(pages.map(x => this.DbController.getImage(x.src)))
      if (option?.type) {
        if (option.type == "JPG") {
          if (option.page == "double") {
            const blobs = await this.download.ImageToTypeBlob({ type: option.type, name: toTitle(x.title), images: pages.map((x: { src: any; }) => x.src), pageOrder: option.pageOrder, isFirstPageCover: option.isFirstPageCover, page: option.page }) as any
            for (let index = 0; index < blobs.length; index++) {
              const blob = blobs[index]
              await this.post(`${config.origin}[双页]${option.pageOrder ? "" : "[日漫]"}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)

            }
          } else {
            const downloadImage = async (x2, index) => {
              const blob = await this.DbController.getImage(x2.src)

              if (blob.size > 500) {
                if (config.is_offprint) {
                  await this.post(`${config.origin}/${toTitle(title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                } else {
                  await this.post(`${config.origin}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                }
              } else {
                const blob = await this.DbController.getImage(x2.src)
                if (blob.size > 500) {
                  if (config.is_offprint) {
                    await this.post(`${config.origin}/${toTitle(title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                  } else {
                    await this.post(`${config.origin}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
                  }
                }
              }
            }
            await Promise.all(pages.map((x2, index) => downloadImage(x2, index)))

          }
          if (option.downloadChapterAtrer) option.downloadChapterAtrer(x)
          continue;
        }

        const blob = await this.download.ImageToTypeBlob({ type: option.type, name: toTitle(x.title), images: pages.map((x: { src: any; }) => x.src), pageOrder: option.pageOrder, isFirstPageCover: option.isFirstPageCover, page: option.page }) as any
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
        if (config.is_offprint) {
          await this.post(`${config.origin}_${suffix_name}[${option.page == "double" ? "双页" : "单页"}]${option.pageOrder ? "" : "[日漫]"}/${toTitle(title)}.${suffix_name}`, blob)
        } else {
          await this.post(`${config.origin}_${suffix_name}[${option.page == "double" ? "双页" : "单页"}]${option.pageOrder ? "" : "[日漫]"}/${toTitle(title)}/${toTitle(x.title)}.${suffix_name}`, blob)
        }
        if (option.downloadChapterAtrer) option.downloadChapterAtrer(x)
      }

    }
  }



}
