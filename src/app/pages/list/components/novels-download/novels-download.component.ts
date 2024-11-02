import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbNovelsControllerService, ImageService, PulgService } from 'src/app/library/public-api';

declare const window: any;

@Component({
  selector: 'app-novels-download',
  templateUrl: './novels-download.component.html',
  styleUrl: './novels-download.component.scss'
})
export class NovelsDownloadComponent {
  list = [];


  type = 'txt'
  source = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public DbNovelsController: DbNovelsControllerService,
    public pulg:PulgService,
    public image:ImageService

  ) {
    this.list = data.list;
    this.source = data.source;
  }


  async download() {
    for (let index = 0; index < this.list.length; index++) {
      const x = this.list[index];
      await this.load(this.source, x.id)
      if (this.type == 'txt') {
      await  this.txt(this.source, x.id)
      }else if(this.type == 'md') {
        this.md(this.source, x.id)
      }else if(this.type == 'json') {
        this.json(this.source, x.id)
      }
    }
  }

  async load(source, id){
    const obj = await this.DbNovelsController.getDetail(id, {
      source: source
    })

    let chapters = obj.chapters
    for (let i = 0; i < chapters.length; i += 6) {
      const batch = chapters.slice(i, i + 6);
      const pagesPromises = batch.map(x =>
        this.DbNovelsController.getPages(x.id, { source: source })
      );

      const pages = await Promise.all(pagesPromises);
    }
  }
  async txt(source, id) {

    const obj = await this.DbNovelsController.getDetail(id, {
      source: source
    })

    let arr1 = obj.chapters

    let novelContent = '';
    novelContent = novelContent + `${obj.title}\n\n`

    novelContent = novelContent + `作者:${obj.author.map(x=>x.name)}\n\n`

    novelContent = novelContent + (`简介:${obj.intro}\n\n`)
    for (let index = 0; index < arr1.length; index++) {
      const x = arr1[index]
      novelContent = novelContent + `${x.title}\n\n`
      const pages = await this.DbNovelsController.getPages(x.id, {
        source: source
      })
      pages.forEach(c => {
        novelContent = novelContent + `${c.content}\n\n`
      })
      novelContent = novelContent + `\n`
    }
    let blob = new Blob([novelContent], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${obj.title}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);

  }
  async word(source, id) {

    const obj = await this.DbNovelsController.getDetail(id, {
      source: source
    })
    let arr1 = obj.chapters.slice(0, 100)
    let novelContent = '';
    for (let index = 0; index < arr1.length; index++) {
      const x = arr1[index]
      novelContent = novelContent + `${x.title}\n\n`
      const pages = await this.DbNovelsController.getPages(x.id, {
        source: source
      })
      pages.forEach(c => {
        novelContent = novelContent + `${c.content}\n\n`
      })
      novelContent = novelContent + `\n`
    }
    let blob = new Blob([novelContent], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${obj.title}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);

  }
  async md(source, id) {

    const obj = await this.DbNovelsController.getDetail(id, {
      source: source
    })
    let arr1 = obj.chapters.slice(0, 100);
    let novelContent = '';
    novelContent = novelContent + `### ${obj.title}\n\n`

     novelContent = novelContent + `**作者:${obj.author.map(x=>x.name)}**\n\n`

      novelContent = novelContent + ('`'+` 简介:${obj.intro}`+'`'+'\n\n')

    for (let index = 0; index < arr1.length; index++) {
      const x = arr1[index]
      novelContent = novelContent + `#### ${x.title}\n\n`
      const pages = await this.DbNovelsController.getPages(x.id, {
        source: source
      })
      pages.forEach(c => {
        novelContent = novelContent + `${c.content.trim()}\n\n`
      })
      novelContent = novelContent + `---\n\n`
    }
    let blob = new Blob([novelContent], { type: 'text/plain' });
    // 创建下载链接
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${obj.title}.md`;

    // 自动点击下载链接
    link.click();

    // 释放 Blob URL
    URL.revokeObjectURL(link.href);

  }
  async json(source, id) {

    const obj = await this.DbNovelsController.getDetail(id, {
      source: source
    })

    let arr1 = obj.chapters.slice(0, 100);
    const  cover=await this.image.getImageBase64(obj.cover)
    let jsonp = {
      title:obj.title??"",
      cover:cover??"",
      author: obj.author??"",
      description:obj.intro??"",
      chapters:[]
    };

    for (let index = 0; index < arr1.length; index++) {
      const x = arr1[index]

      const pages = await this.DbNovelsController.getPages(x.id, {
        source: source
      })
      const content=pages.map(c => c.content)
      jsonp.chapters.push({
        title:x.title,
        content:content
      })
    }
    let blob = new Blob([JSON.stringify(jsonp)], { type: 'text/plain' });
    // 创建下载链接
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${obj.title}.json`;

    // 自动点击下载链接
    link.click();

    // 释放 Blob URL
    URL.revokeObjectURL(link.href);

  }

}
