import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CurrentReaderService } from '../../services/current.service';
import { ReadTimeService } from '../read-time/read-time.service';

@Component({
  selector: 'app-chapter-history',
  templateUrl: './chapter-history.component.html',
  styleUrls: ['./chapter-history.component.scss']
})
export class ChapterHistoryComponent {

  constructor(
    public db: NgxIndexedDBService,
    public readTime: ReadTimeService,
    public current: CurrentReaderService
  ) {
    this.db.getAll('image_state').subscribe((x: any) => {
      const list = x.filter(x => x.comicsId == this.current.comics.id);
      const filter_list=this.sortAndRemoveDuplicates(list)
      console.log(filter_list);


    });

  }

  sortAndRemoveDuplicates(arr) {
    //使用Map数据结构，去除数组中id相同的元素，保留date较大的那个
    let map = new Map();
    for (let item of arr) {
      //获取元素的id和date属性
      let id = item.chapterId;
      let date = item.id;
      //如果Map中已经存在该id，比较date的大小，保留较大的那个
      if (map.has(id)) {
        //获取Map中元素的date
        let oldDate = map.get(id).date;
        //如果新元素的date大于旧元素的date，更新Map中的元素
        if (date > oldDate) {
          map.set(id, item);
        }
      } else {
        //如果Map中不存在该id，直接将元素添加到Map中
        map.set(id, item);
      }
    }
    //创建一个空数组，用于存储排序后的结果
    let result = [];
    //遍历Map中的每个键值对
    for (let [key, value] of map) {
      //将键值对的值放入数组中
      result.push(value);
    }
    //按照date从大到小进行排序
    result.sort((a, b) => b.date - a.date);
    //返回排序后的数组
    return result;
  }
}
