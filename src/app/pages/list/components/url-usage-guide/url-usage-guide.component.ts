import { Component } from '@angular/core';
import { DbEventService } from 'src/app/library/public-api';
import { UrlUsageGuideService } from './url-usage-guide.service';

@Component({
  selector: 'app-url-usage-guide',
  templateUrl: './url-usage-guide.component.html',
  styleUrl: './url-usage-guide.component.scss'
})
export class UrlUsageGuideComponent {
  list=[];
  constructor(
    public DbEvent:DbEventService,
    public UrlUsageGuide:UrlUsageGuideService
  ){
    Object.keys(this.DbEvent.Configs).forEach(x=>{
      if(this.DbEvent.Configs[x].href){
        this.list.push(this.DbEvent.Configs[x])
      }
    })


  }
  on(href){
    window.open(href);
    this.UrlUsageGuide.close();
  }
}
