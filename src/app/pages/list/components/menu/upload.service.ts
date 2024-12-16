
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  forkJoin } from 'rxjs';
import { CacheControllerService, IndexdbControllerService } from 'src/app/library/public-api';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  chaptersId = new Date().getTime();
  constructor(
    private webDB: IndexdbControllerService,
    private webCh: CacheControllerService,
    private http: HttpClient
  ) {


  }
  async subscribe_to_temporary_file_directory(files, id) {

    this.list=[];
    const deepMerge = (obj1, obj2) => {
      var isPlain1 = isPlainObject(obj1);
      var isPlain2 = isPlainObject(obj2);
      //obj1或obj2中只要其中一个不是对象，则按照浅合并的规则进行合并
      if (!isPlain1 || !isPlain2) return shallowMerge(obj1, obj2);
      //如果都是对象，则进行每一层级的递归合并
      let keys = [
        ...Object.keys(obj2),
        ...Object.getOwnPropertySymbols(obj2)
      ]
      keys.forEach(function (key) {
        obj1[key] = deepMerge(obj1[key], obj2[key]);//这里递归调用
      });

      return obj1;
    }
    const shallowMerge = (obj1, obj2) => {
      var isPlain1 = isPlainObject(obj1);
      var isPlain2 = isPlainObject(obj2);
      //只要obj1不是对象，那么不管obj2是不是对象，都用obj2直接替换obj1
      if (!isPlain1) return obj2;
      //走到这一步时，说明obj1肯定是对象，那如果obj2不是对象，则还是以obj1为主
      if (!isPlain2) return obj1;
      //如果上面两个条件都不成立，那说明obj1和obj2肯定都是对象， 则遍历obj2 进行合并
      let keys = [
        ...Object.keys(obj2),
        ...Object.getOwnPropertySymbols(obj2)
      ]
      keys.forEach(function (key) {
        obj1[key] = obj2[key];
      });

      return obj1;
    }

    const isPlainObject = (obj) => {
      var proto, Ctor;
      if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") {
        return false;
      }
      proto = Object.getPrototypeOf(obj);
      if (!proto) return true;
      Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
    }

    let obj = {
      chapter: [],
      chapters: [],
      roll: [],
      roll_extra_episode: [],
    };
    files.forEach(x => {
      const paths = x.path.split(".");
      const type = paths.at(-1);
      if (!["gif", "png", "jpg", "jpeg", "bmp", "webp"].includes(type)) return
      x['relativePath'] = x['path'];
      x['name'] = x.path.split("/").at(-1);
      if (x['relativePath'].split("/").length == 2) obj.chapter.push(x)
      if (x['relativePath'].split("/").length == 3) obj.chapters.push(x)
      if (x['relativePath'].split("/").length == 4) obj.roll.push(x)
      if (x['relativePath'].split("/").length == 5) obj.roll_extra_episode.push(x)
    })

    if (obj.chapter.length) await this.addChapter(obj.chapter)
    if (obj.chapters.length) await this.addChapters(obj.chapters)
    if (obj.roll.length) await this.addRoll(obj.roll)
    if (obj.roll_extra_episode.length) await this.addRollExtraEpisode(obj.roll_extra_episode)

    const time = new Date().getTime();
    let j = 0;
    this.list.forEach(x => {
      x.createTime = undefined;
      x.source = undefined;
      x.size = undefined;
      x.createTime = undefined;
    })
    return this.list.map(x => ({
      ...x.comics
    }))
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

  }
  list = [];
  progress = 0;

  addList(comics, state) {
    const id = comics.id
    this.list.push({ id, comics, state })
  }
  async addChapter(files) {
    const addComics = async (name, files) => {
      const pages = this.fileName123(files);
      const size = files.map(x => x.size).reduce((acr, cur) => acr + cur);
      const id = new Date().getTime();
      let comics = {
        id:window.btoa(encodeURIComponent(pages[0].relativePath)),
        source: "local",
        title: name,
        size: size,
        createTime: this.chaptersId,
        cover: pages[0],
        chapters: [
          {
            id: this.chaptersId,
            title: "单行本",
            date: this.chaptersId,
            pages: pages
          },
        ]
      };
      this.chaptersId++;
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: "单行本",
          index: 0,
          total: comics.chapters[0].pages.length
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
      const pages = this.fileName123(files);

      const size = files.map(x => x.size).reduce((acr, cur) => acr + cur);
      const id = new Date().getTime();

      let comics = {
        id: window.btoa(encodeURIComponent(pages[0].relativePath)),
        source: "local",
        title: name,
        size: size,
        createTime:this.chaptersId,
        cover: pages[0],
        chapters: [
          {
            id: window.btoa(encodeURIComponent(pages[0].relativePath)),
            title: "单行本",
            date: this.chaptersId,
            pages: pages
          },
        ]
      };
      this.chaptersId++;
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: "单行本",
          index: 0,
          total: comics.chapters[0].pages.length
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
        id: "",
        source: "local",
        size: size,
        title: name,
        createTime: this.chaptersId,
        cover: "",
        chapters: []
      };
      this.chaptersId++;
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
        const pages = objFiles[x]

        if (i == 0) {
          comics.id=window.btoa(encodeURIComponent(pages[0].relativePath))
          comics.cover = pages[0];
        }

        comics.chapters.push({
          id: window.btoa(encodeURIComponent(pages[0].relativePath)),
          title: x,
          pages: pages
        })
        this.chaptersId++;
      }
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: comics.chapters[0].title,
          index: 0,
          total: comics.chapters[0].pages.length
        }
      };
      return { comics,state }
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
      const size = files.map(x => x.size).reduce((acr, cur) => acr + cur);
      let comics = {
        id: this.chaptersId.toString(),
        source: "local",
        title: name,
        size: size,
        createTime: this.chaptersId,
        cover: "",
        chapters: []
      };
      this.chaptersId++;
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
      let chaptersId = new Date().getTime();
      for (let i = 0; i < names.length; i++) {
        const x = names[i];
        const pages = objFiles[x]
        if (i == 0) {
          comics.id=window.btoa(encodeURIComponent(pages[0].relativePath))
          comics.cover = pages[0];
        }

        comics.chapters.push({
          id: window.btoa(encodeURIComponent(pages[0].relativePath)),
          title: x,
          date: this.chaptersId,
          pages: pages
        })
        this.chaptersId++;
      }
      const state = {
        id: comics.id,
        mode: 1,
        chapter: {
          id: comics.chapters[0].id,
          title: comics.chapters[0].title,
          index: 0,
          total: comics.chapters[0].pages.length
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
  getpages = async (files: Array<any>, isCompress) => {
    const names = files.map(x => x['name']);
    const sortNames = this.fileNameSort(names);
    const blobToHref = async (id: string | number, file: any) => {
      let blob = null;
      if (600000 < file.size && isCompress) {
        // blob = await compressAccurately((file as any), { size: 350, accuracy: 0.9, width: 1280, orientation: 1, scale: 0.5, })
      } else {
        blob = file
      }
      const pagesrc = `${document.querySelector("base").href}/image/${id}`;
      const request = pagesrc;
      const response = new Response(blob);
      await this.webCh.put('image',request, response);
      return { id: id, src: pagesrc }
    }
    let list = [];
    const id = new Date().getTime();
    for (let i = 0; i < sortNames.length;) {
      const name = sortNames[i];
      const index = files.findIndex(x => x['name'] == name);
      list.push(blobToHref(id + i, files[index]));
      i++
    }
    const res = await Promise.all(list);
    return res
  }

  async add(comics, state, isCompress = false) {
    comics.cover = (await this.getpages([comics.chapters[0].pages[0]], true))[0];
    let list = [];
    const time = new Date().getTime()
    for (let index = 0; index < comics.chapters.length; index++) {
      comics.chapters[index].id = time + index;
      comics.chapters[index].date = time + index;
      list.push(this.getpages(comics.chapters[index].pages, isCompress))
    }
    for (let index = 0; index < comics.chapters.length; index++) {
      const pages = await Promise.all(list)
      comics.chapters[index].pages = pages[index];
    }
    state.chapter.id = comics.chapters[0].id;
    state.isFirstPageCover = false;
    state.pageOrder = false;
  }

  async addGithubPages(comics, state, isCompress = false) {
    // for (let index = 0; index < comics.chapters.length; index++) {
    //   const time=new Date().getTime();
    //   comics.chapters[index].id=time;
    //   comics.chapters[index].date=time;
    //   comics.chapters[index].pages= await this.getpages(comics.chapters[index].pages,isCompress)
    // }
    // state.chapter.id=comics.chapters[0].id;
    // comics.cover=comics.chapters[0].pages[0];
    // const res= await (([this.webDB.update('comics', comics), this.webDB.update('state', state)]))
    // return res
  }


}
