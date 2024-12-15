import { Component, Inject } from '@angular/core';
import { SelectTagMultipleService } from './select-tag-multiple.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';

@Component({
  selector: 'app-select-tag-multiple',
  templateUrl: './select-tag-multiple.component.html',
  styleUrl: './select-tag-multiple.component.scss'
})
export class SelectTagMultipleComponent {
  list= []
  name=""
  constructor(
    public SelectTagMultiple: SelectTagMultipleService,
    public GamepadEvent:GamepadEventService,
    public GamepadController:GamepadControllerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data,

  ) {
    this.list=data.list;
    this.name=data.name;
    this.list.forEach((x,i)=> {
      x.value = data.value.map(x=>x.index);
      x.tags.forEach((c,i2)=>{
        c.index=`${i}_${i2}`
      })
    })
    GamepadEvent.registerAreaEvent('chip_option_v32', {
      "LEFT": e => {
        this.GamepadController.setCurrentTarget("LEFT")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option_v32] button") as any).focus()

          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option_v32] button") as any).blur()
          }, 20)
        }, 100)

      },
      "UP": (e) => {
        this.GamepadController.setCurrentTarget("UP")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option_v32] button") as any).focus()

          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option_v32] button") as any).blur()
          }, 20)
        }, 100)
      },
      "DOWN": (e) => {
        this.GamepadController.setCurrentTarget("DOWN")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option_v32] button") as any).focus()

          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option_v32] button") as any).blur()
          }, 20)
        }, 100)

      },
      "RIGHT": (e) => {
        this.GamepadController.setCurrentTarget("RIGHT")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option_v32] button") as any).focus()
          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option_v32] button") as any).blur()
          }, 20)
        }, 100)
      },
      "A": (e) => {
        setTimeout(() => {
          if (document.querySelector("[select=true][region=chip_option_v32] button").getAttribute("aria-selected") == "true") {
            (document.querySelector("[select=true][region=chip_option_v32] button") as any).click()
          } else {
            (document.querySelector("[select=true][region=chip_option_v32] button") as any).click()
          }
          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option_v32] button") as any).blur()
          }, 20)
        }, 100)
      },
      "B":()=>{
        this.SelectTagMultiple.close();
      }
    })
  }

  on() {
    let arr = [];
    this.list.forEach(x => {
      if (x.value) {
        x.value.forEach(c => {
          const index=x.tags.findIndex(f=>f.index==c)
          if(index>-1){
            arr.push({
              ...x.tags[index]
            })
          }
        })
      }
    })
    this.SelectTagMultiple.value = arr;
    this.SelectTagMultiple.opened = false;
  }

  close(){
    this.SelectTagMultiple.close();
  }

}
