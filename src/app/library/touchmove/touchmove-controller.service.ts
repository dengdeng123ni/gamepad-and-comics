import { Injectable } from '@angular/core';
import { TouchmoveEventService } from './touchmove-event.service';

@Injectable({
  providedIn: 'root'
})
export class TouchmoveControllerService {

  constructor(public TouchmoveEvent:TouchmoveEventService) { }

  init(){

      const swipeArea = document.documentElement;

      let initialDistance = 0;
      let startX = 0, startY = 0;
      let isPinch = false;
      let isSwipe = false;

      // 计算两触摸点之间的距离
      function calculateDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
      }

      swipeArea.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          // 记录两个触摸点的初始位置（捏合）
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          initialDistance = calculateDistance(touch1, touch2);
        }

        // 记录开始位置（滑动）
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          startX = touch.clientX;
          startY = touch.clientY;
        }
      });

      swipeArea.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          // 计算当前两触摸点的距离
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const currentDistance = calculateDistance(touch1, touch2);

          if (currentDistance > initialDistance) {
            if (!isPinch) {
              // alert('放大')
              isPinch = true;
            }
          } else if (currentDistance < initialDistance) {
            if (!isPinch) {
              // alert(`${initialDistance},${initialDistance}`,)
              isPinch = true;
            }
          }
        } else if (e.touches.length === 1) {
          // 计算滑动
          const touch = e.touches[0];
          const diffX = touch.clientX - startX;
          const diffY = touch.clientY - startY;

          if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
              // console.log('向右滑动',diffX < -95);
              if (diffX > 95) {
                if (diffY < 70) {
                  const KEY=document.body.getAttribute('locked_region')
                  if(this.TouchmoveEvent.Events[KEY]&&this.TouchmoveEvent.Events[KEY]["LEFT"]){
                    this.TouchmoveEvent.Events[KEY]["LEFT"](e);
                  }
                }

                if (diffY < -70) {
                  const KEY=document.body.getAttribute('locked_region')
                  if(this.TouchmoveEvent.Events[KEY]&&this.TouchmoveEvent.Events[KEY]["LEFT"]){
                    this.TouchmoveEvent.Events[KEY]["LEFT"](e);
                  }
                }

              }
            } else {
              // console.log('向左滑动',diffX , -95,diffX < -95);
              if (diffX < -95) {
                if (diffY < 70) {
                  const KEY=document.body.getAttribute('locked_region')
                  if(this.TouchmoveEvent.Events[KEY]&&this.TouchmoveEvent.Events[KEY]["RIGHT"]){
                    this.TouchmoveEvent.Events[KEY]["RIGHT"](e);
                  }
                }

                if (diffY < -70) {
                  const KEY=document.body.getAttribute('locked_region')
                  if(this.TouchmoveEvent.Events[KEY]&&this.TouchmoveEvent.Events[KEY]["RIGHT"]){
                    this.TouchmoveEvent.Events[KEY]["RIGHT"](e);
                  }
                }
              }
            }
            isSwipe = true;
          }
        }
      });

      swipeArea.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
          // 重置状态，清除捏合的判断
          isPinch = false;
          initialDistance = 0;
        }

        if (e.touches.length < 1) {
          // 重置滑动判断
          isSwipe = false;
        }
      });
      swipeArea.removeEventListener


  }
}
