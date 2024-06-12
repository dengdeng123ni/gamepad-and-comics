import { Injectable } from '@angular/core';
import { GamepadControllerService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  constructor(public GamepadController:GamepadControllerService) {


  }


  oBox = null;
  oDiv = null;
  x
  y
  zoomSize = 1;
  DELTA = 0.05 // 每次放大/缩小的倍数

  init(){
    this.oBox = document.querySelector('.mat-drawer-content')
    this.oDiv = document.querySelector('#_reader_pages')


  }
  down(e) {
    let current = this.GamepadController.getHandelState();
    current[e] = true;
    if (current.LEFT_ANALOG_LEFT || current.LEFT_ANALOG_UP || current.LEFT_ANALOG_RIGHT || current.LEFT_ANALOG_DOWN) {
      let angle = this.getAngle(current.LEFT_ANALOG_HORIZONTAL_AXIS, current.LEFT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move("LEFT_UP") : this.move("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move("UP") : this.move("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move("RIGHT_UP") : this.move("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move("RIGHT") : this.move("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move("RIGHT_DOWN") : this.move("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move("DOWN") : this.move("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move("LEFT_DOWN") : this.move("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
    } else if (current.RIGHT_ANALOG_LEFT || current.RIGHT_ANALOG_UP || current.RIGHT_ANALOG_RIGHT || current.RIGHT_ANALOG_DOWN) {
      let angle = this.getAngle(current.RIGHT_ANALOG_HORIZONTAL_AXIS, current.RIGHT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move("LEFT_UP") : this.move("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move("UP") : this.move("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move("RIGHT_UP") : this.move("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move("RIGHT") : this.move("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move("RIGHT_DOWN") : this.move("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move("DOWN") : this.move("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move("LEFT_DOWN") : this.move("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
    } else if (current.DPAD_DOWN || current.DPAD_LEFT || current.DPAD_RIGHT || current.DPAD_UP) {
      if (current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("UP") : this.move("DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("RIGHT") : this.move("LEFT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("LEFT") : this.move("RIGHT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move("DOWN") : this.move("UP");
      else if (current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("RIGHT_UP") : this.move("LEFT_DOWN");
      else if (current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move("LEFT_UP") : this.move("RIGHT_DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move("RIGHT_DOWN") : this.move("LEFT_UP");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move("LEFT_DOWN") : this.move("RIGHT_UP");
    }
  }
  down2(e) {
    let current = this.GamepadController.getHandelState();
    current[e] = true;
    if (current.LEFT_ANALOG_LEFT || current.LEFT_ANALOG_UP || current.LEFT_ANALOG_RIGHT || current.LEFT_ANALOG_DOWN) {
      let angle = this.getAngle(current.LEFT_ANALOG_HORIZONTAL_AXIS, current.LEFT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move_max("LEFT_UP") : this.move_max("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move_max("UP") : this.move_max("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move_max("RIGHT_UP") : this.move_max("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move_max("RIGHT") : this.move_max("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move_max("RIGHT_DOWN") : this.move_max("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move_max("DOWN") : this.move_max("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move_max("LEFT_DOWN") : this.move_max("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
    } else if (current.RIGHT_ANALOG_LEFT || current.RIGHT_ANALOG_UP || current.RIGHT_ANALOG_RIGHT || current.RIGHT_ANALOG_DOWN) {
      let angle = this.getAngle(current.RIGHT_ANALOG_HORIZONTAL_AXIS, current.RIGHT_ANALOG_VERTICAL_AXIS);
      if (22.5 >= angle && angle >= 0) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
      else if (67.5 >= angle && angle >= 22.5) this.zoomSize > 1 ? this.move_max("LEFT_UP") : this.move_max("RIGHT_DOWN");
      else if (112.5 >= angle && angle >= 67.5) this.zoomSize > 1 ? this.move_max("UP") : this.move_max("DOWN");
      else if (157.5 >= angle && angle >= 112.5) this.zoomSize > 1 ? this.move_max("RIGHT_UP") : this.move_max("LEFT_DOWN");
      else if (202.5 >= angle && angle >= 157.5) this.zoomSize > 1 ? this.move_max("RIGHT") : this.move_max("LEFT");
      else if (247.5 >= angle && angle >= 202.5) this.zoomSize > 1 ? this.move_max("RIGHT_DOWN") : this.move_max("LEFT_UP");
      else if (292.5 >= angle && angle >= 247.5) this.zoomSize > 1 ? this.move_max("DOWN") : this.move_max("UP");
      else if (337.5 >= angle && angle >= 292.5) this.zoomSize > 1 ? this.move_max("LEFT_DOWN") : this.move_max("RIGHT_UP");
      else if (360 >= angle && angle >= 337.5) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
    } else if (current.DPAD_DOWN || current.DPAD_LEFT || current.DPAD_RIGHT || current.DPAD_UP) {
      if (current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("UP") : this.move_max("DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("RIGHT") : this.move_max("LEFT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("LEFT") : this.move_max("RIGHT");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move_max("DOWN") : this.move_max("UP");
      else if (current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("RIGHT_UP") : this.move_max("LEFT_DOWN");
      else if (current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && !current.DPAD_UP) this.zoomSize > 1 ? this.move_max("LEFT_UP") : this.move_max("RIGHT_DOWN");
      else if (!current.DPAD_DOWN && current.DPAD_LEFT && !current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move_max("RIGHT_DOWN") : this.move_max("LEFT_UP");
      else if (!current.DPAD_DOWN && !current.DPAD_LEFT && current.DPAD_RIGHT && current.DPAD_UP) this.zoomSize > 1 ? this.move_max("LEFT_DOWN") : this.move_max("RIGHT_UP");
    }
  }
  getAngle = (x, y): number => {
    x = parseFloat(x);
    y = parseFloat(y);
    var a = Math.atan2(y, x);
    var ret = a * 180 / Math.PI; //弧度转角度，方便调试
    if (ret > 360) {
      ret -= 360;
    }
    if (ret < 0) {
      ret += 360;
    }
    return ret;
  }

  // 放大移动图片
  move = (move) => {
    // this.isMouseDown = true;
    let transf = this.getTransform(this.oDiv);
    let multiple = transf.multiple;
    let newTransf = null;
    if (move == "UP") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY - 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "DOWN") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`;
        }, 15 * i)
      }
    }
    if (move == "RIGHT") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 20 * i, transf.transY, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "LEFT") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 20 * i, transf.transY, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "RIGHT_UP") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 20 * i, transf.transY - 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "RIGHT_DOWN") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 20 * i, transf.transY + 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "LEFT_UP") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 20 * i, transf.transY - 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    if (move == "LEFT_DOWN") {
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 20 * i, transf.transY + 20 * i, transf.multiple);
          this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
        }, 15 * i)
      }
    }
    // if (move == "DOWN") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 50, transf.multiple)
    // if (move == "RIGHT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 50, transf.transY, transf.multiple)
    // if (move == "LEFT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 50, transf.transY, transf.multiple)
    // this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
  }
  move_max = (move) => {
    // this.isMouseDown = true;
    let transf = this.getTransform(this.oDiv);
    let multiple = transf.multiple;
    let newTransf = null;
    if (move == "UP") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY - 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "DOWN") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`;
    }
    if (move == "RIGHT") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 200000, transf.transY, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "LEFT") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 200000, transf.transY, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "RIGHT_UP") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 200000, transf.transY - 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "RIGHT_DOWN") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 200000, transf.transY + 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "LEFT_UP") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 200000, transf.transY - 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    if (move == "LEFT_DOWN") {
      newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 200000, transf.transY + 200000, transf.multiple);
      this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
    }
    // if (move == "DOWN") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY + 50, transf.multiple)
    // if (move == "RIGHT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX + 50, transf.transY, transf.multiple)
    // if (move == "LEFT") newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX - 50, transf.transY, transf.multiple)
    // this.oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
  }
  zoomIn = () => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple += this.DELTA;
    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`
    this.zoomSize = transf.multiple;
  }
  zoomOut = () => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple -= this.DELTA
    if( transf.multiple<=0.5) transf.multiple=0.5

    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`
    this.zoomSize = transf.multiple;
  }
  zoom = (e: number) => {
    let transf = this.getTransform(this.oDiv)
    transf.multiple = e;
    let newTransf = this.limitBorder(this.oDiv, this.oBox, transf.transX, transf.transY, transf.multiple)
    this.oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`;
    this.zoomSize = transf.multiple;
  }
  getTransform = DOM => {
    let arr = getComputedStyle(DOM).transform.split(',')
    return {
      transX: isNaN(+arr[arr.length - 2]) ? 0 : +arr[arr.length - 2], // 获取translateX
      transY: isNaN(+arr[arr.length - 1].split(')')[0]) ? 0 : +arr[arr.length - 1].split(')')[0], // 获取translateX
      multiple: +arr[3] // 获取图片缩放比例
    }
  }
  limitBorder = (innerDOM, outerDOM, moveX, moveY, multiple) => {
    let { clientWidth: innerWidth, clientHeight: innerHeight, offsetLeft: innerLeft, offsetTop: innerTop } = innerDOM
    let { clientWidth: outerWidth, clientHeight: outerHeight } = outerDOM
    let transX
    let transY
    // 放大的图片超出box时 图片最多拖动到与边框对齐
    if (innerWidth * multiple > outerWidth || innerHeight * multiple > outerHeight) {
      if (innerWidth * multiple > outerWidth && innerWidth * multiple > outerHeight) {
        transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
      } else if (innerWidth * multiple > outerWidth && !(innerWidth * multiple > outerHeight)) {
        transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
      } else if (!(innerWidth * multiple > outerWidth) && innerWidth * multiple > outerHeight) {
        transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
      }
    }
    // 图片小于box大小时 图片不能拖出边框
    else {
      transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
      transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
    }

    return { transX, transY }
  }
}
