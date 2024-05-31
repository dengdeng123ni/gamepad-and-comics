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
  list=[]
  lists={}
  constructor(
    public utils: UtilsService,
    private zone: NgZone,
    public data: DataService,
    public current: CurrentService,

  ) {
    this.init();

  }
  async getDoublePages(pages: { id: string; width: number; height: number; src: string; }[]) {
    const list = pages.map((x: any) => ({
      id: x.id,
      width: x.width,
      height: x.height,
      src: x.src
    }))
    const is_first_page_cover= await this.current._getChapter_IsFirstPageCover(this.data.chapter_id);

    const double_list = await this.utils.Images.getPageDouble(list, { isFirstPageCover: is_first_page_cover, pageOrder: this.data.comics_config.is_page_order });

    return double_list
  }


  async init(){
    this.data.chapters= this.data.chapters.splice(0,5);
    this.data.chapters.forEach(x=>{
      this.lists[x.id]=[]
    })
    for (let index = 0; index < this.data.chapters.length; index++) {
      const item=this.data.chapters[index];
       const pages= await this.current._getChapter(item.id);
       let doub= await this.getDoublePages(pages)
       const arr=doub.splice(0,3);
       this.lists[item.id]=arr;

    }

    console.log(this.lists);
  }
}
