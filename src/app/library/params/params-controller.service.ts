import { Injectable } from '@angular/core';
import { ParamsEventService } from './params-event.service';
import { TemporaryDataControllerService } from '../temporary-data/temporary-data-controller.service';
import { RoutingControllerService } from '../routing-controller.service';

@Injectable({
  providedIn: 'root'
})
export class ParamsControllerService {

  constructor(
    public ParamsEvent: ParamsEventService,
    public RoutingController: RoutingControllerService,
    public TemporaryDataController: TemporaryDataControllerService
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


  }

  init() {
    const obj = this.getAllParams(window.location.href)
    if(JSON.stringify(obj) === '{}') return
    const keys = Object.keys(obj)
    const keys123= Object.keys(this.ParamsEvent.Configs)
    for (let index = 0; index < keys123.length; index++) {
      let rhg= this.ParamsEvent.Configs[keys123[index]].sort()
      if(rhg.toString()==keys.sort().toString()){
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
