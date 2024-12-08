import { Component } from '@angular/core';
import { Router } from '@angular/router';


import { DbControllerService, IndexdbControllerService } from '../public-api';
import { ReadRecordChapterService } from './read-record-chapter.service';

@Component({
  selector: 'app-read-record-chapter',
  templateUrl: './read-record-chapter.component.html',
  styleUrl: './read-record-chapter.component.scss'
})
export class ReadRecordChapterComponent {
  list = [];
  constructor(public webDb: IndexdbControllerService, public ReadRecordChapter: ReadRecordChapterService, public router: Router,public DbController:DbControllerService) {
    this.init();
  }

  async init() {
    const read_record: any = await this.webDb.getAll('read_record')
    const details: any = await this.webDb.getAll('details')
    let list = read_record.reverse()

    list.forEach(x => {
      x.date = this.formaData(x.id)
      x.day = x.date.substring(0, 10)
      x.data = (details.find(c => c.id == x.comics_id))?.data


    })

    list = list.filter(x => !!x.data)
    list.forEach(x => {
      x.data.cover = `http://localhost:7700/${x.source}/comics/${x.data.id}`;
    })
    const days = [...new Set(list.map(x => x.day))].reverse();
    let arr = [];
    days.forEach(x => {
      let  csd=[];
      this.uniqueFunc(list.filter(c => c.day == x), 'chapter_id').sort((a,b)=>b.id-a.id).forEach(c=>{
        let obj=JSON.parse(JSON.stringify(c))
        obj.data.chapter=obj.data.chapters.find(e=>e.id.toString()==obj.chapter_id.toString());
        obj.data.chapter.cover = `http://localhost:7700/${obj.source}/comics/${obj.data.id}`;
        csd.push(obj)
      })
      arr.unshift( {
        day: x,
        list: csd
      })
    })
    this.list = arr;
  }
  uniqueFunc(arr, uniId) {
    const res = new Map();
    return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
  }

  formaData(timer) {
    timer = new Date(timer)
    const pad = (timeEl, total = 2, str = '0') => {
      return timeEl.toString().padStart(total, str)
    }
    const year = timer.getFullYear()
    const month = timer.getMonth() + 1 // 由于月份从0开始，因此需加1
    const day = timer.getDate()
    const hour = timer.getHours()
    const minute = timer.getMinutes()
    const second = timer.getSeconds()
    return `${pad(year, 4)}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
  }

  close() {
    this.ReadRecordChapter.close();
  }

  async routerReader(source, comics_id) {
    const _res: any = await Promise.all([this.DbController.getDetail(comics_id),this.webDb.getByKey("last_read_comics", comics_id.toString())])
    if (_res[1]) {
      this.router.navigate(['/comics', source, comics_id, _res[1].chapter_id])
    } else {
      this.router.navigate(['/comics', source, comics_id, _res[0].chapters[0].id])
    }
  }
  on(e){

  }
}
