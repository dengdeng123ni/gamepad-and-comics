import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbEventService } from '../public-api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  source = ""
  source$ = new Subject();

  is_pulg = false;
  is_pwa = false;
  is_web_worker=false;

  local_network_url="";


  public sourceChange() {
    return this.source$
  }
  sourceConfig={};
  constructor(public DbEvent: DbEventService,
    public router: Router,

  ) {

    setTimeout(async ()=>{
      if(!this.local_network_url){
        const isLocalAddress=(ip)=> {
          const localRanges = [
            /^10\./, // 10.0.0.0 - 10.255.255.255
            /^192\.168\./, // 192.168.0.0 - 192.168.255.255
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./ // 172.16.0.0 - 172.31.255.255
          ];

          // 判断 IP 是否匹配任一局域网范围
          return localRanges.some(range => range.test(ip));
        }
        const bool= isLocalAddress(window.location.hostname)
        if(bool){
          this.local_network_url=window.location.origin;
        }

       try {
        const response = await fetch('http://localhost:7708/api/get/ip');
        if (!response.ok) {
        }
        const res = await response.json(); // 解析 JSON
        this.local_network_url=`https://${res.IP}:7707`;
      } catch (error) {
      }
      }
    },2000)
  }
  init(){
    if (false) {
      this.router.navigate(['/']);
    }
  }

  setsource(source: string) {
    this.source = source;
    const x = this.DbEvent.Configs[source];
     this.sourceConfig=x;
     this.source$.next(x)
    document.body.setAttribute('source',source)
  }
  getOption() {
    return this.DbEvent.Configs[this.source]
  }
}
