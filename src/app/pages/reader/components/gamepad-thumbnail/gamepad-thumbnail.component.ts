import { Component, NgZone } from '@angular/core';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { CurrentReaderService } from '../../services/current.service';
import { GamepadThumbnailService } from './gamepad-thumbnail.service';

@Component({
  selector: 'app-gamepad-thumbnail',
  templateUrl: './gamepad-thumbnail.component.html',
  styleUrls: ['./gamepad-thumbnail.component.scss']
})
export class GamepadThumbnailComponent {
  list = [];
  index = 0;
  width = 0;
  chapter$=null;
  constructor(
    public current: CurrentReaderService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public GamepadThumbnail:GamepadThumbnailService,
    private zone: NgZone,

  ) {
    GamepadEvent.registerAreaEvent('gamepad_thumbnail', {
      UP:()=>{
        this.move("UP")
      },
      LEFT:()=>{
        this.move("LEFT")
      },
      RIGHT:()=>{
        this.move("RIGHT")
      },
      DOWN:()=>{
        this.move("DOWN")
      },
      X: () => {

      },
      A: () => {
        this.current.pageChange(this.index);
        this.GamepadThumbnail.close();
      },
      B: () => {
        this.GamepadThumbnail.close();
      },
      LEFT_BUMPER: () => {
        this.previous();
      },
      RIGHT_BUMPER: () => {
        this.next();
      },
      RIGHT_ANALOG_PRESS: () => {
      },
      LEFT_TRIGGER: () => {
        this.current.previous();
      },
      RIGHT_TRIGGER: () => {
        this.current.next();
      }
    })
    this.chapter$ = this.current.chapter().subscribe(async x => {
      this.init(this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id).images)
    })
  }
  ngOnDestroy() {
    this.chapter$.unsubscribe();
  }
  move(e) {
    let state = this.GamepadController.getHandelState();
    state[e]=true;
    if (state.LEFT_ANALOG_LEFT || state.LEFT_ANALOG_UP || state.LEFT_ANALOG_RIGHT || state.LEFT_ANALOG_DOWN) {
      const angle=this.GamepadController.getAngle(state.LEFT_ANALOG_HORIZONTAL_AXIS,state.LEFT_ANALOG_VERTICAL_AXIS)
      this.zone.run(() => {
        this.index = (this.list.filter(x => (x.angle+90) < angle)).length-1;
      })
    } else if (state.RIGHT_ANALOG_LEFT || state.RIGHT_ANALOG_UP || state.RIGHT_ANALOG_RIGHT || state.RIGHT_ANALOG_DOWN) {
      const angle=this.GamepadController.getAngle(state.RIGHT_ANALOG_HORIZONTAL_AXIS,state.RIGHT_ANALOG_VERTICAL_AXIS)
      this.zone.run(() => {
        this.index = (this.list.filter(x => (x.angle+90) < angle)).length-1;
      })
    } else if (state.DPAD_DOWN || state.DPAD_LEFT || state.DPAD_RIGHT || state.DPAD_UP) {
      if (state.DPAD_DOWN && !state.DPAD_LEFT && !state.DPAD_RIGHT && !state.DPAD_UP) this.next()
      else if (!state.DPAD_DOWN && state.DPAD_LEFT && !state.DPAD_RIGHT && !state.DPAD_UP) this.previous();
      else if (!state.DPAD_DOWN && !state.DPAD_LEFT && state.DPAD_RIGHT && !state.DPAD_UP) this.next()
      else if (!state.DPAD_DOWN && !state.DPAD_LEFT && !state.DPAD_RIGHT && state.DPAD_UP) this.previous();
    }
  }
  next(){
    this.zone.run(() => {
      this.index++;
      if(this.index==this.list.length){
        this.index=0
      }
    })


  }
  previous(){
    this.zone.run(() => {
      this.index--;
      if(this.index==-1){
        this.index=this.list.length-1
      }
    })
  }
  init(list) {
    let { innerWidth, innerHeight } = window;
    this.width = innerHeight * 0.8;
    let width = innerHeight * 0.8;
    let height = innerHeight * 0.8;
    let radius = width / 2;
    let circumference = Math.PI * radius * 2;
    const node: any = document.querySelector("#gamepad_thumbnail");
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;
    // node.style.transform=`scale(0.8) translateX(-${width * 0.02}px) translateY(-${width * 0.02}px)`;
    const item_height = circumference / list.length;
    const aaa = 360 / list.length;
    for (let index = 0; index < list.length; index++) {
      const angle = aaa * index - 90;

      // 将角度转换为弧度
      const angleRadians = angle * (Math.PI / 180);
      // 计算点的极坐标
      const polarCoordinates = { radius: radius, angle: angleRadians };
      // 将极坐标转换为直角坐标
      const x = polarCoordinates.radius * Math.cos(polarCoordinates.angle);
      const y = polarCoordinates.radius * Math.sin(polarCoordinates.angle);
      const left = x + radius - 20;
      const top = y + radius - item_height / 2;
      list[index].left = left;
      list[index].top = top;
      list[index].angle = angle;
      list[index].height = item_height * 0.75;
      list[index].border_radius = item_height > 30 ? 2 : 0;
      list[index].index =index;

    }
    this.list = list;
    this.index = this.current.comics.chapter.index;
  }
  ngAfterViewInit() {
    this.init(this.current.comics.chapters.find(x => x.id == this.current.comics.chapter.id).images)
  }
}
