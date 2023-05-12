import { Injectable } from '@angular/core';
import { GamepadEventService } from './gamepad-event.service';
import { GamepadInputService } from './gamepad-input.service';

@Injectable({
  providedIn: 'root'
})
export class GamepadVoiceService {
  actions = {
    open: "打开",
    close: "关闭",

    B:"",

  }
  constructor(
    public GamepadEvent: GamepadEventService,
    public GamepadInput:GamepadInputService
    ) {
    const res = this.fuzzyQuery(['打开', '点击'], '打开设置');
    console.log(res);
    // open click
    // 动作 目标
    setTimeout(() => {
      // this.init("打开藤本树");

    }, 1000)

    setTimeout(() => {
      // this.init("关闭");
      this.init("打开相似度")
    }, 2000)

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
  strSimilarity2Percent(s, t) {
    var l = s.length > t.length ? s.length : t.length;
    var d = 0;
    for (var i = 0; i < l; i++) {
        if (s.charAt(i) == t.charAt(i)) {
            d++;
        }
    }
    return (d / l);
}
  init(str: string) {
    const router=document.body.getAttribute("router");

    let targetKeywords=[];
    Object.keys(this.GamepadEvent.voiceEvents).forEach(c=>{
      Object.keys(this.GamepadEvent.voiceEvents[c]).forEach(x=>{
          this.GamepadEvent.voiceEvents[c][x].keywords.forEach(keyword=>{
            targetKeywords.push({key:x,keyword:keyword})
          })
      })
    })

    const action = this.fuzzyQuery(Object.keys(this.actions).map(x => this.actions[x]), str)[0];
    if(action&&!action.length) return
    const actionKey = Object.keys(this.actions).filter(x => this.actions[x] == action)[0];
    var reg= new RegExp(action, "i");
    const newStr = str.replace(reg, "");

    if (actionKey == 'open') {
      const nodes=document.querySelectorAll("[ng-reflect-message]")
      let list=[];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const str=node.getAttribute("ng-reflect-message");
        const similarity=this.strSimilarity2Percent(newStr,str.replace(/ /g, ""))
        list.push({
          index:i,
          str:str,
          similarity:similarity
        })
      }
      list.sort((a,b)=>b.similarity-a.similarity)
      console.log(list);
      if(list[0].similarity==0) return
      const node=nodes[list[0].index];
      console.log(node);

      (node as any).click();

    };

    if(actionKey =="close"){
      this.close();
    };

  }

  close(){
    this.GamepadInput.down$.next("B")
  }
}
