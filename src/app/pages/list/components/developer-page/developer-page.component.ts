import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { map, async } from 'rxjs';
import { DbComicsControllerService, IndexdbControllerService } from 'src/app/library/public-api';

@Component({
  selector: 'app-developer-page',
  templateUrl: './developer-page.component.html',
  styleUrl: './developer-page.component.scss'
})
export class DeveloperPageComponent {
  source
  constructor(public webDb: IndexdbControllerService,
    public DbComicsController: DbComicsControllerService,
    public router: Router,
    public route: ActivatedRoute,

  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(async (params) => {
      this.source = params.get('id')
    }
    )
  }
  value = ""
  async on() {
    const c = await this.DbComicsController.UrlToDetailId(this.value,{
      source:this.source
    });
    console.log("已匹配到当前ID:", c);
    console.log("开始获取漫画数据");
    const j = await this.DbComicsController.getDetail(c,{
      source:this.source,
      is_cache:false
    });
    console.log("获取漫画数据成功",j);
    console.log("开始获取章节数据");
    const e = await this.DbComicsController.getPages(j.chapters[0].id,{
      source:this.source,
      is_cache:false
    });
    console.log("获取漫画数据成功",e);
  }
}
