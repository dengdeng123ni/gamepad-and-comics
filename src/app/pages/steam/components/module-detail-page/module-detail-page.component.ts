import { Component } from '@angular/core';

@Component({
  selector: 'app-module-detail-page',
  templateUrl: './module-detail-page.component.html',
  styleUrl: './module-detail-page.component.scss'
})
export class ModuleDetailPageComponent {
  info={
    title:"【月之门】<size=26><color=#990000>天命气运多选</color></size>",
    href:"",
    author:[],
    styles:[],
    intro:`1、气运多选多锁：
开局气运可选择3个或以上，可锁定多个气运；
<color=#990000>阴阳眼、噬魂剑、莲花剑意三个天命气运可同时选择</color>；
可选择多个游戏通关的奖励气运；
并且对玩家信息界面的先天气运UI进行了优化，选择多个气运时，不会再挡住下面的资质属性面板。

2、筛选开局气运品质：
开局随机出的气运品质可<color=#990000>自定义</color>，可以<color=#990000>全红</color>、全橙、或任意搭配；

3、一步到位选择你需要的气运：
点击此模组气运筛选面板的“书本”按钮，可以直接打开气运列表查看<color=#990000>所有可选的气运</color>，并选择你需要的气运。

4、随时更换逆天改命：
在境界突破界面，<color=#990000>点击</color>自己已经拥有的<color=#990000>逆天改命</color>，就会弹出更换界面。

5、玩家角色界面特效开关：
如果你<color=#990000>同时拥有阴阳眼、噬魂剑、莲花剑意，那你的角色界面中这三个特效会叠加在一起，看起来很混乱</color>，此功能允许你随时<color=#990000>关闭或显示</color>任一特效。
打开玩家信息界面，点击<color=#990000>角色立绘左上角的“放大镜”</color>，就会显示开关面板。
    `,
    cover:"https://images.steamusercontent.com/ugc/33313508834458581/DB15128F3B6C4B015324232B2574BE4B68CA3874/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
    id:""
  };
  continue(){

  }

  on(e){

  }
}
