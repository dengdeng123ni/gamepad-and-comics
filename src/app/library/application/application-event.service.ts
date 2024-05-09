import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationEventService {
  // public Events: { [key: string]: Events } = {};
  constructor() {
    const config = {
      id: "",
      name: "",
      type: "",
      event: () => { }
    }

    // 控制器事件
    // 页面事件
    // 全局事件
    // ['controller','page','all']
  }
}
