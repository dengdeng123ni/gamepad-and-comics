import { Injectable } from '@angular/core';
interface Events {
  click: Record<string, Function>;
  dbclick: Record<string, Function>;
}
@Injectable({
  providedIn: 'root'
})
export class WindowEventService {
  // 鼠标事件:
  // "click": 鼠标点击事件。
  // "dbclick": 鼠标双击事件。
  // "mousedown": 鼠标按下事件。
  // "mouseup": 鼠标释放事件。
  // "mousemove": 鼠标移动事件。
  // "mouseover": 鼠标悬停事件。
  // "mouseout": 鼠标移出事件。
  // "mouseenter": 鼠标进入事件。
  // "mouseleave": 鼠标离开事件.
  // 键盘事件:
  // "keydown": 键盘按下事件。
  // "keyup": 键盘释放事件。
  // "keypress": 键盘按键事件。
  // 表单事件:
  // "submit": 表单提交事件。
  // "change": 输入元素的值发生改变事件。
  // "input": 输入元素的值输入事件。
  // "focus": 元素获得焦点事件。
  // "blur": 元素失去焦点事件。
  // 触摸事件:
  // "touchstart": 触摸开始事件。
  // "touchmove": 触摸移动事件。
  // "touchend": 触摸结束事件。
  // "touchcancel": 触摸取消事件。
  // 拖拽事件:
  // "dragstart": 拖拽开始事件。
  // "drag": 拖拽事件。
  // "dragend": 拖拽结束事件。
  // 窗口事件:
  // "resize": 窗口大小改变事件。
  // "scroll": 页面滚动事件。
  // "load": 页面加载完成事件。
  // "unload": 页面卸载事件。
  // 媒体事件:
  // "play": 媒体播放事件。
  // "pause": 媒体暂停事件。
  // "ended": 媒体播放结束事件。
  constructor() { }
  clickRegionEvents: Record<string, Function> = {}
  clickSectionEvents: Record<string, Function> = {}
  registerClickRegion(key: string, fun: Function) {
     this.clickRegionEvents[key]=fun;
  }
  registerClickSection(key: string, fun: Function) {
    this.clickSectionEvents[key]=fun;
  }
}
