import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { compressAccurately } from 'image-conversion';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom, forkJoin } from 'rxjs';
import { UploadListService } from '../components/upload-list/upload-list.service';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    public uploadList: UploadListService,
    private db: NgxIndexedDBService,
    private http: HttpClient
  ) {

  }
  async image(files) {
    let obj = {
      chapter: [],
      chapters: [],
      roll: [],
      roll_extra_episode: [],
    };
    files.forEach(x => {
      x['relativePath'] = x['webkitRelativePath'];
      if (x['relativePath'].split("/").length == 2) obj.chapter.push(x)
      if (x['relativePath'].split("/").length == 3) obj.chapters.push(x)
      if (x['relativePath'].split("/").length == 4) obj.roll.push(x)
      if (x['relativePath'].split("/").length == 5) obj.roll_extra_episode.push(x)
    })

    if (obj.chapter.length) await this.addChapter(obj.chapter)
    if (obj.chapters.length) await this.addChapters(obj.chapters)
    if (obj.roll.length) await this.addRoll(obj.roll)
    if (obj.roll_extra_episode.length) await this.addRollExtraEpisode(obj.roll_extra_episode)

    this.uploadList.open();
  }
  async zip(files) {
    let obj = {
      chapter: [],
      chapters: [],
      roll: [],
      roll_extra_episode: [],
    };
    files.forEach(x => {
      if (x['relativePath'].split("/").length == 2) obj.chapter.push(x)
      if (x['relativePath'].split("/").length == 3) obj.chapters.push(x)
      if (x['relativePath'].split("/").length == 4) obj.roll.push(x)
      if (x['relativePath'].split("/").length == 5) obj.roll_extra_episode.push(x)
    })

    if (obj.chapter.length) await this.addChapter(obj.chapter)
    if (obj.chapters.length) await this.addChapters(obj.chapters)
    if (obj.roll.length) await this.addRoll(obj.roll)
    if (obj.roll_extra_episode.length) await this.addRollExtraEpisode(obj.roll_extra_episode)

    this.uploadList.open();
  }
  list = [];
  progress = 0;

  addList(comics, state) {
    const id = comics.id
    this.list.push({ id, comics, state })
  }
  async addChapter(files) {
    const addComics = async (name, files) => {
      const images = this.fileName123(files);
      const size = files.map(x => x.size).reduce((acr, cur) => acr + cur);
      const id = new Date().getTime();
      let comics = {
        id: new Date().getTime(),
        origin: "local",
        title: name,
        size: size,
        createTime: new Date().getTime(),
        cover: images[0],
        chapters: [
          {
            id: new Date().getTime(),
            title: "单行本",
            date: new Date().getTime(),
            images: images
          },
        ]
      };
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: "单行本",
          index: 0,
          total: comics.chapters[0].images.length
        }
      };
      return { comics, state }
    }
    const list = this.getRepeatNum2(files, files.map(x => x['relativePath'].split("/")[0]));
    for (let i = 0; i < Object.keys(list).length; i++) {
      const x = Object.keys(list)[i];
      const { comics, state } = await addComics(x, list[x])
      this.addList(comics, state)
    }
  }

  async addChapters(files) {
    const addComics = async (name, files) => {
      const images = this.fileName123(files);

      const size = files.map(x => x.size).reduce((acr, cur) => acr + cur);
      const id = new Date().getTime();
      let comics = {
        id: new Date().getTime(),
        origin: "local",
        title: name,
        size: size,
        createTime: new Date().getTime(),
        cover: images[0],
        chapters: [
          {
            id: new Date().getTime(),
            title: "单行本",
            date: new Date().getTime(),
            images: images
          },
        ]
      };
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: "单行本",
          index: 0,
          total: comics.chapters[0].images.length
        }
      };
      return { comics, state }
    }
    const list = this.getRepeatNum2(files, files.map(x => x['relativePath'].split("/")[1]));

    for (let i = 0; i < Object.keys(list).length; i++) {
      const x = Object.keys(list)[i];
      const { comics, state } = await addComics(x, list[x])
      this.addList(comics, state)
    }
  }
  async addRoll(files) {
    const addComics = async (name, files) => {
      const id = new Date().getTime();
      const size = files.map(x => x.size).reduce((acr, cur) => acr + cur);
      let comics = {
        id: id,
        origin: "local",
        size: size,
        title: name,
        createTime: id,
        cover: "",
        chapters: []
      };
      const obj = this.getRepeatNum(files.map(x => x.relativePath.split("/")[2]));
      let names = [];
      let objFiles = {};
      Object.keys(obj).map(x => files.splice(0, obj[x])).forEach(x => {
        x.sort((x: any, c: any) => x["name"].replace(/[^0-9]/ig, "") - c["name"].replace(/[^0-9]/ig, ""))
        const name = x[0]["relativePath"].split("/")[2]
        names.push(name);
        objFiles[name] = x;
      });
      names = this.fileNameSort(names);
      for (let i = 0; i < names.length; i++) {
        const x = names[i];
        const images = objFiles[x]
        if (i == 0) comics.cover = images[0];
        const chaptersId = new Date().getTime();
        comics.chapters.push({
          id: chaptersId,
          title: x,
          date: chaptersId,
          images: images
        })
      }
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: comics.chapters[0].title,
          index: 0,
          total: comics.chapters[0].images.length
        }
      };
      return { comics, state }
    }
    const list = this.getRepeatNum2(files, files.map(x => x['relativePath'].split("/")[1]));
    for (let i = 0; i < Object.keys(list).length; i++) {
      const x = Object.keys(list)[i];
      const { comics, state } = await addComics(x, list[x])
      this.addList(comics, state)
    }
  }
  async addRollExtraEpisode(files) {
    const addComics = async (name, files) => {
      const id = new Date().getTime();
      const size = files.map(x => x.size).reduce((acr, cur) => acr + cur);
      let comics = {
        id: id,
        origin: "local",
        title: name,
        size: size,
        createTime: id,
        cover: "",
        chapters: []
      };
      const obj = this.getRepeatNum(files.map(x => x.relativePath.split("/")[3]));
      let names = [];
      let objFiles = {};
      Object.keys(obj).map(x => files.splice(0, obj[x])).forEach(x => {
        x.sort((x: any, c: any) => x["name"].replace(/[^0-9]/ig, "") - c["name"].replace(/[^0-9]/ig, ""))
        const name = x[0]["relativePath"].split("/")[3]
        names.push(name);
        objFiles[name] = x;
      });
      names = this.fileNameSort(names);
      for (let i = 0; i < names.length; i++) {
        const x = names[i];
        const images = objFiles[x]
        if (i == 0) comics.cover = images[0];
        const chaptersId = new Date().getTime();
        comics.chapters.push({
          id: chaptersId,
          title: x,
          date: chaptersId,
          images: images
        })
      }
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: comics.chapters[0].title,
          index: 0,
          total: comics.chapters[0].images.length
        }
      };
      return { comics, state }
    }
    const list3 = this.getRepeatNum2(files, files.map(x => x['relativePath'].split("/")[1]));
    let list = {};
    Object.keys(list3).forEach(nie => {
      const list2 = this.getRepeatNum2(list3[nie], list3[nie].map(x => x.relativePath.split("/")[2]));
      Object.keys(list2).forEach(x => {
        const name = `${nie}[${x}]`;
        list[name] = list2[x];
      })
      return list
    })
    for (let i = 0; i < Object.keys(list).length; i++) {
      const x = Object.keys(list)[i];
      const { comics, state } = await addComics(x, list[x])
      this.addList(comics, state)
    }
  }
  getRepeatNum(arr) {
    var obj = {};
    for (var i = 0, l = arr.length; i < l; i++) {
      var item = arr[i];
      obj[item] = (obj[item] + 1) || 1;
    }
    return obj;
  }
  getRepeatNum2(files, arr) {
    var obj = {};
    for (var i = 0, l = arr.length; i < l; i++) {
      var item = arr[i];
      obj[item] = obj[item] ? [...obj[item], files[i]] : [files[i]]
    }
    return obj;
  }
  fileNameSort(fileNames) {
    const regexp = /[^\d]+|\d+/g;
    const result = fileNames.map(name => ({ name, weights: name.match(regexp) })).sort((a, b) => {
      let pos = 0;
      const weightsA = a.weights;
      const weightsB = b.weights;
      let weightA = weightsA[pos];
      let weightB = weightsB[pos];
      while (weightA && weightB) {
        const v = weightA - weightB;
        if (!isNaN(v) && v !== 0) return v;
        if (weightA !== weightB) return weightA > weightB ? 1 : -1;
        pos += 1;
        weightA = weightsA[pos];
        weightB = weightsB[pos];
      }
      return weightA ? 1 : -1;
    });
    return result.map(x => x.name)
  }
  getImages = async (files: Array<NzUploadFile>, isCompress = false) => {
    const names = files.map(x => x['name']);
    const sortNames = this.fileNameSort(names);
    let arr: Array<any> = [];
    const cache = await caches.open('image');
    for (let i = 0; i < sortNames.length;) {
      const name = sortNames[i];
      // const id = new Date().getTime();
      const index = files.findIndex(x => x['name'] == name);
      let blob = null;
      if (600000 < files[index].size && isCompress) {

        blob = await compressAccurately(files[index] as any, 350);
      } else {
        blob = files[index]
      }
      const formData = new FormData();
      formData.append('file', blob);
      const id = await firstValueFrom(this.http.post("http://localhost:7899/image/upload", formData))
      // const id = "";
      // const src = URL.createObjectURL(files[index] as any);
      // const imageSrc = `${window.location.origin}/image/${id}`;
      // const request = new Request(imageSrc);
      // const response = await fetch(src)
      // await cache.put(request, response);
      // URL.revokeObjectURL(src)
      arr.push({ id: new Date().getTime(), src: `http://localhost:7899/image/${id}` });
      i++
    }

    return arr
  }
  fileName123(files) {
    let arr = [];
    const names = files.map(x => x['name']);
    const sortNames = this.fileNameSort(names);
    for (let i = 0; i < sortNames.length;) {
      const name = sortNames[i];
      const index = files.findIndex(x => x['name'] == name);
      arr.push(files[index])
      i++;
    }
    return arr
  }
  // getImages = async (files: Array<NzUploadFile>, isCompress) => {
  //   const names = files.map(x => x['name']);
  //   const sortNames = this.fileNameSort(names);
  //   let arr: Array<any> = [];
  //   const cache = await caches.open('image');
  //   for (let i = 0; i < sortNames.length;) {
  //     const name = sortNames[i];
  //     const id = new Date().getTime();
  //     const index = files.findIndex(x => x['name'] == name);
  //     let blob = null;
  //     if (500000 < files[index].size && isCompress) {
  //       blob = await compressAccurately(files[index] as any, 350);
  //     } else {
  //       blob = files[index]
  //     }
  //     const src = URL.createObjectURL(blob);
  //     const imageSrc = `${window.location.origin}/image/${id}`;
  //     const request = new Request(imageSrc);
  //     const response = await fetch(src)
  //     await cache.put(request, response);
  //     URL.revokeObjectURL(src)
  //     arr.push({ id: id, src: imageSrc });
  //     i++
  //   }
  //   return arr
  // }
  async add(comics, state, isCompress = false) {
    comics.cover =(await this.getImages([comics.chapters[0].images[0]], true))[0];
    for (let index = 0; index < comics.chapters.length; index++) {
      const time = new Date().getTime();
      comics.chapters[index].id = time;
      comics.chapters[index].date = time;
      comics.chapters[index].images = await this.getImages(comics.chapters[index].images, isCompress)
    }
    state.chapter.id = comics.chapters[0].id;
    state.isFirstPageCover = false;
    state.pageOrder = false;
    const res = await firstValueFrom(forkJoin([this.db.update('comics', comics), this.db.update('state', state)]))
    return res
  }
  async addGithubPages(comics, state, isCompress = false) {
    // for (let index = 0; index < comics.chapters.length; index++) {
    //   const time=new Date().getTime();
    //   comics.chapters[index].id=time;
    //   comics.chapters[index].date=time;
    //   comics.chapters[index].images= await this.getImages(comics.chapters[index].images,isCompress)
    // }
    // state.chapter.id=comics.chapters[0].id;
    // comics.cover=comics.chapters[0].images[0];
    // const res= await firstValueFrom(forkJoin([this.db.update('comics', comics), this.db.update('state', state)]))
    // return res
  }

}
