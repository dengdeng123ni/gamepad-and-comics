import { Component } from '@angular/core';
import { DbComicsEventService } from 'src/app/library/public-api';
import { UrlUsageGuideService } from './url-usage-guide.service';

@Component({
  selector: 'app-url-usage-guide',
  templateUrl: './url-usage-guide.component.html',
  styleUrl: './url-usage-guide.component.scss'
})
export class UrlUsageGuideComponent {
  list=[];
  constructor(
    public DbComicsEvent:DbComicsEventService,
    public UrlUsageGuide:UrlUsageGuideService
  ){
    Object.keys(this.DbComicsEvent.Configs).forEach(x=>{
      if(this.DbComicsEvent.Configs[x].href){
        this.list.push(this.DbComicsEvent.Configs[x])
      }
    })


  }
  on(href){
    window.open(href);
    this.UrlUsageGuide.close();
  }
}
