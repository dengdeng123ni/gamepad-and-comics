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
      'images', async e => {
      const id = await TemporaryDataController.add_comics(e.pages.split(","), {
        title: e.title
      })
      this.RoutingController.routerReader('temporary_data', id)
    })

  }

  init() {
    const obj = this.getAllParams(window.location.href)
    const keys = Object.keys(obj)
    for (let index = 0; index < keys.length; index++) {
      const c = this.ParamsEvent.params[keys[index]]
      if (c) {
        c(obj)
        break;
      }
    }
  }

  getAllParams(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    const allParams = Object.fromEntries((params as any).entries());
    return allParams
  }

}
