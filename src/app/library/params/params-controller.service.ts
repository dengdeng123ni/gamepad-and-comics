import { Injectable } from '@angular/core';
import { ParamsEventService } from './params-event.service';
import { TemporaryDataControllerService } from '../temporary-data/temporary-data-controller.service';
import { RoutingControllerService } from '../routing-controller.service';
import { AppDataService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class ParamsControllerService {

  constructor(
    public ParamsEvent: ParamsEventService,
    public RoutingController: RoutingControllerService,
    public TemporaryDataController: TemporaryDataControllerService,
    public AppData:AppDataService,
  ) {

    // ParamsEvent._register_params_key_type(
    //   'comics', async e => {
    //     const id = await TemporaryDataController.add_comics(e.pages.split(","), {
    //       title: e.title
    //     })
    //     this.RoutingController.routerReader('temporary_data', id)
    //   })


    ParamsEvent._register_params(
      ['pages'], async e => {
        const id = await TemporaryDataController.add_comics(e.pages.split(","), {
          title: e.title
        })
        this.RoutingController.routerReader('temporary_data', id)
      })

    ParamsEvent._register_params(
      ['config'], async e => {
         try {
          const jsonString = decodeURIComponent(window.atob(e.config));
          const obj = JSON.parse(jsonString);
          if(obj){
            if(obj.local_network_url){
               this.AppData.local_network_url=obj.local_network_url;
            }
          }
         } catch (error) {

         }
      })

  }
  objectToBase64(obj) {
    const jsonString = JSON.stringify(obj);
    const base64String = window.btoa(encodeURIComponent(jsonString));
    return base64String;
  }

  init() {
    const obj = this.getAllParams(window.location.href)
    if (JSON.stringify(obj) === '{}') return
    const keys = Object.keys(obj)
    const keys123 = Object.keys(this.ParamsEvent.Configs)
    for (let index = 0; index < keys123.length; index++) {
      let rhg = this.ParamsEvent.Configs[keys123[index]].sort()
      if (rhg.toString() == keys.sort().toString()) {
        this.ParamsEvent.Events[keys123[index]](obj)
      }
    }
  }

  getAllParams(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    const allParams = Object.fromEntries((params as any).entries());
    return allParams
  }

}
