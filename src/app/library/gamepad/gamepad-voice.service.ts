// @ts-nocheck
import { Injectable } from '@angular/core';
import { GamepadEventService } from './gamepad-event.service';
import { GamepadInputService } from './gamepad-input.service';

import { I18nService } from '../public-api';
@Injectable({
  providedIn: 'root'
})
export class GamepadVoiceService {
  actions = {
    open: "打开",
    click: "点击",
    close: "关闭",
    exit: "退出",
    full: "全屏",

    "scroll_down": "向下滚动",
    "scroll_up": "向上滚动",
  }
  gamepad = {
    UP: '上',
    RIGHT: '右',
    DOWN: '下',
    LEFT: '左',
    LEFT_ANALOG_PRESS: '工具栏',
    RIGHT_ANALOG_PRESS: '右摇杆按钮',
    A: '点击',
    B: '返回',
    X: '菜单',
    Y: '组合键',
    LEFT_TRIGGER: '左缓冲键',
    LEFT_BUMPER: '左扳机键',
    RIGHT_TRIGGER: '右缓冲键',
    RIGHT_BUMPER: '右扳机键',
    SELECT: '视图按钮',
    START: '菜单按钮',
    SPECIAL: '配置文件按钮'
  }
  mahjong = {
    UP: '北风',
    RIGHT: '东风',
    DOWN: '南风',
    LEFT: '西风',
    A: '红中',
    B: '白板',
    X: '发财',
    LEFT_ANALOG_PRESS: '幺鸡',
  }
  constructor(
    public GamepadEvent: GamepadEventService,
    public I18n:I18nService,
    public GamepadInput: GamepadInputService
  ) {

  }

  fuzzyQuery(list, keyWord) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (keyWord.indexOf(list[i]) >= 0) {
        arr.push(list[i]);
      }
    }
    return arr;
  }
  strSimilarity2Percent(x, y) {
    var z = 0;
    x = x.toUpperCase();
    y = y.toUpperCase();
    x = x.replace('_', '');
    y = y.replace('_', '');
    if (typeof x == "string") {
      x = x.split("");
      y = y.split("");
    }
    var s = x.length + y.length;
    x.sort();
    y.sort();
    var a = x.shift();
    var b = y.shift();
    while (a !== undefined && b != undefined) {
      if (a === b) {
        z++;
        a = x.shift();
        b = y.shift();
      } else if (a < b) {
        a = x.shift();
      } else if (a > b) {
        b = y.shift();
      }
    }
    return z / s * 2;
  }
  is_onf = false;
 async  init(_str: string) {
    if (this.is_onf) return
    else this.is_onf = true;
    setTimeout(() => {
      this.is_onf = false;
    }, 1000)
    const region = document.body.getAttribute("locked_region");
    const str = this.GamepadEvent.configs[region].region.map(x => `[region=${x}][ng-reflect-message]`).toString();
    const nodes = document.querySelectorAll(str)
    const action = this.fuzzyQuery(Object.keys(this.actions).map(x => this.actions[x]), _str)[0];
    var reg = new RegExp(action, "i");
    const newStr = _str.replace(reg, "");


    if (!action || action && !action.length) {
      let list = [];
      Object.keys(this.GamepadEvent.voiceEvents).forEach(x => {
        if (region != x) return
        Object.keys(this.GamepadEvent.voiceEvents[x]).forEach(c => {
          this.GamepadEvent.voiceEvents[x][c].keywords.forEach(f => {
            list.push({ keyword: f, event: this.GamepadEvent.voiceEvents[x][c].event, region: x, key: c })
          })
        })
      })
      for (let i = 0; i < list.length; i++) {

        const item = list[i];
        const similarity = this.strSimilarity2Percent(_str, item.keyword.replace(/ /g, ""))

        list[i].index = i;
        list[i].similarity = similarity;
      }
      list.sort((a, b) => b.similarity - a.similarity)
      if (list[0] && list[0].similarity != 0) {
        list[0].event();
        return
      }

      const gamepad = this.fuzzyQuery(Object.keys(this.gamepad).map(x => this.gamepad[x]), _str)[0];
      let gamepad2={}
      const keys=Object.keys(this.gamepad);
      for (let index = 0; index < keys.length; index++) {
        const element = this.gamepad[keys[index]];

        gamepad2[keys[index]]=await this.I18n.getTranslatedText(element)
      }

      const gamepad23 = this.fuzzyQuery(Object.keys(gamepad2).map(x => gamepad2[x]), _str)[0];
      const mahjong = this.fuzzyQuery(Object.keys(this.mahjong).map(x => this.mahjong[x]), _str)[0];

      if (gamepad) {
        const gamepadKey = Object.keys(this.gamepad).filter(x => this.gamepad[x] == gamepad)[0];
        this.GamepadInput.down$.next(gamepadKey)
      }else if(gamepad23){
        const gamepadKey = Object.keys(gamepad2).filter(x => gamepad2[x] == gamepad)[0];
        this.GamepadInput.down$.next(gamepadKey)
      }else if(mahjong){
        const mahjongKey = Object.keys(this.mahjong).filter(x => this.mahjong[x] == mahjong)[0];
        this.GamepadInput.down$.next(mahjongKey)
      } else {
        let list = [];
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const str = node.getAttribute("ng-reflect-message");
          const similarity = this.strSimilarity2Percent(_str, str.replace(/ /g, ""))
          list.push({
            index: i,
            str: str,
            similarity: similarity
          })
        }

        list.sort((a, b) => b.similarity - a.similarity)
        if (!list[0] || list[0] && list[0].similarity < 0.01) return
        const node: any = nodes[list[0].index];
        const type = node.getAttribute("type")
        if (type == 'chip' || type == 'slide') {
          node.querySelector("button").click();
        } else if (type == 'radio') {
          node.querySelector("input").click();
        } else if (type == 'checkbox') {
          node.querySelector("[type=checkbox]").click();
        } else {
          node.click();
        }
      }
    }
    else {
      const actionKey = Object.keys(this.actions).filter(x => this.actions[x] == action)[0];
      if (actionKey == 'open') {
        let list = [];
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const str = node.getAttribute("ng-reflect-message");
          const similarity = this.strSimilarity2Percent(newStr, str.replace(/ /g, ""))
          list.push({
            index: i,
            str: str,
            similarity: similarity
          })
        }
        list.sort((a, b) => b.similarity - a.similarity)
        if (list[0].similarity == 0) return

        const node = nodes[list[0].index];
        (node as any).click();
      };
      if (actionKey == 'click') {
        let list = [];
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const str = node.getAttribute("ng-reflect-message");
          const similarity = this.strSimilarity2Percent(newStr, str.replace(/ /g, ""))
          list.push({
            index: i,
            str: str,
            similarity: similarity
          })
        }
        list.sort((a, b) => b.similarity - a.similarity)
        if (list[0].similarity == 0) {

          if (newStr.length < 2) {
            const node: any = nodes[list[0].index];
            const type = node.getAttribute("type")
            if (type == 'chip' || type == 'slide') {
              node.querySelector("button").click();
            } else if (type == 'radio') {
              node.querySelector("input").click();
            } else if (type == 'checkbox') {
              node.querySelector("[type=checkbox]").click();
            } else {
              node.click();
            }
          }
          return
        }

        const node = nodes[list[0].index];
        (node as any).click();
      };
      if (actionKey == "close" || actionKey == "exit") {
        this.close();
      };
      if (actionKey == "full") {
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          }
        }
      };
      if (actionKey == "scroll_down") {
        const scrollToTop = () => {
          const node = document.querySelector(`[locked_region=${region}] [type=list]`);
          var hScrollTop = node.scrollTop;
          var hScrollHeight = node.scrollHeight;
          var height = 1;
          if ((height + hScrollTop) >= hScrollHeight) {//滚动条已经到了容器底部
            node.scrollTop = 0;
          } else {
            var h = hScrollTop + height;
            node.scrollTop = h;
            window.requestAnimationFrame(scrollToTop)
          }
        }
        scrollToTop();
      }
      if (actionKey == "scroll_up") {
        const scrollToTop = () => {
          const node = document.querySelector(`[locked_region=${region}] [type=list]`);
          var hScrollTop = node.scrollTop;
          var hScrollHeight = node.scrollHeight;
          var height = 1;
          if ((height + hScrollTop) <= 0) {//滚动条已经到了容器底部
            node.scrollTop = 0;
          } else {
            var h = hScrollTop - height;
            node.scrollTop = h;
            window.requestAnimationFrame(scrollToTop)
          }
        }
        scrollToTop();
      }
    }



  }

  close() {
    this.GamepadInput.down$.next("B")
  }
}
