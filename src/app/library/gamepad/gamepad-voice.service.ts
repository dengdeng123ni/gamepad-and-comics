import { Injectable } from '@angular/core';
import { GamepadEventService } from './gamepad-event.service';
import { GamepadInputService } from './gamepad-input.service';

@Injectable({
  providedIn: 'root'
})
export class GamepadVoiceService {
  actions = {
    open: "打开",
    click: "点击",
    close: "关闭",
  }
  gamepad = {
    UP: '上',
    RIGHT: '右',
    DOWN: '下',
    LEFT: '左',
    LEFT_ANALOG_PRESS: '左摇杆按钮',
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
  constructor(
    public GamepadEvent: GamepadEventService,
    public GamepadInput: GamepadInputService
  ) {
    const res = this.fuzzyQuery(['打开', '点击'], '打开设置');
    // open click

    // 动作 目标
    setTimeout(() => {
      // this.init("上一章");
      // this.init("打开短篇集")

    }, 1000)

    setTimeout(() => {
      // this.init("关闭");
      // this.init("点击第11话")
    }, 2000)
    // setTimeout(() => {
    //   // this.init("关闭");
    //   this.init("右")
    // }, 3000)
    // setTimeout(() => {
    //   // this.init("关闭");
    //   this.init("点击")
    // }, 4000)

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
  init(_str: string) {
    const router = document.body.getAttribute("router");

    const action = this.fuzzyQuery(Object.keys(this.actions).map(x => this.actions[x]), _str)[0];
    var reg = new RegExp(action, "i");
    const newStr = _str.replace(reg, "");

    if (!action || action && !action.length) {
      const gamepad = this.fuzzyQuery(Object.keys(this.gamepad).map(x => this.gamepad[x]), _str)[0];
      console.log(gamepad);

      if(gamepad){
        const gamepadKey = Object.keys(this.gamepad).filter(x => this.gamepad[x] == gamepad)[0];
        this.GamepadInput.down$.next(gamepadKey)
      }else{
        const nodes = document.querySelectorAll("[ng-reflect-message]")
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
        console.log(list);

        if (list[0].similarity < 0.5) return
        const node = nodes[list[0].index];
        console.log(node);

        (node as any).click();
      }
    }
    else {
      const actionKey = Object.keys(this.actions).filter(x => this.actions[x] == action)[0];
      if (actionKey == 'open') {
        const nodes = document.querySelectorAll("[ng-reflect-message]")
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
        console.log(list);
        if (list[0].similarity == 0) return

        const node = nodes[list[0].index];
        (node as any).click();
      };
      if (actionKey == 'click') {
        const nodes = document.querySelectorAll("[ng-reflect-message]")
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

          if (newStr.length < 2) this.GamepadInput.down$.next("A")
          return
        }

        const node = nodes[list[0].index];
        (node as any).click();
      };
      if (actionKey == "close") {
        this.close();
      };
    }



  }

  close() {
    this.GamepadInput.down$.next("B")
  }
}
