import { Component, NgZone } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UtilsService } from 'src/app/library/public-api';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-comics-settings',
  templateUrl: './comics-settings.component.html',
  styleUrl: './comics-settings.component.scss'
})
export class ComicsSettingsComponent {
  list = []
  lists = {}
  constructor(
    public utils: UtilsService,
    private zone: NgZone,
    public data: DataService,
    public current: CurrentService,

  ) {
    this.init();

  }
  async getDoublePages(pages,is_first_page_cover) {
    const list = pages.map((x: any) => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: x.src
    }))
    const double_list = await this.utils.Images.getPageDouble(list, { isFirstPageCover: is_first_page_cover, pageOrder: this.data.comics_config.is_page_order });
    return double_list
  }


  async init() {
    this.list = this.data.chapters
    this.data.chapters.forEach(x => {
      this.lists[x.id] = []
    })
    for (let index = 0; index < this.data.chapters.length; index++) {
      const item = this.data.chapters[index];
      let pages = await this.current._getChapter(item.id);
      this.list[index].is_first_page_cover = await this.current._getChapter_IsFirstPageCover(this.list[index].id)
      let arr = await this.getDoublePages(pages.slice(0, 3),this.list[index].is_first_page_cover)
      this.lists[item.id] = arr;
    }
  }

  async gefa(id) {
    const obj = this.list.find(x => x.id == id)
    await this.current._setChapterFirstPageCover(obj.id, obj.is_first_page_cover)
    let pages = await this.current._getChapter(obj.id);
    this.zone.run(async ()=>{
      this.lists[obj.id]= await this.getDoublePages(pages.slice(0, 3),obj.is_first_page_cover)
    })
  }

  async all() {
    this.zone.run(async ()=>{
      for (let index = 0; index < this.list.length; index++) {
        this.list[index].is_first_page_cover=true;
        await this.current._setChapterFirstPageCover(this.list[index].id, true)
        let pages = await this.current._getChapter(this.list[index].id);
        this.zone.run(async ()=>{
          this.lists[this.list[index].id]= await this.getDoublePages(pages.slice(0, 3),true)
        })
      }
    })

  }

  async rev() {
    this.zone.run(async ()=>{
      for (let index = 0; index < this.list.length; index++) {
        this.list[index].is_first_page_cover=!this.list[index].is_first_page_cover;
        let pages = await this.current._getChapter(this.list[index].id);
        await this.current._setChapterFirstPageCover(this.list[index].id, this.list[index].is_first_page_cover)
        this.zone.run(async ()=>{
          this.lists[this.list[index].id]= await this.getDoublePages(pages.slice(0, 3),this.list[index].is_first_page_cover)
        })
      }
    })
  }
}
