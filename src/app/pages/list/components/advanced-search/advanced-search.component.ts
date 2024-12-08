import { Component, Inject, Input, Optional } from '@angular/core';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { WhenInputtingService } from '../when-inputting/when-inputting.service';
import { AdvancedSearchService } from './advanced-search.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SelectInputNumberService } from '../select-input-number/select-input-number.service';
import { SelectTagMultipleService } from '../select-tag-multiple/select-tag-multiple.service';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent {

  @Input() list: Array<any> = [];
  @Input() change: Function;
  @Input() query_fixed: Function;

  constructor(public GamepadEvent: GamepadEventService,
    public WhenInputting: WhenInputtingService,
    public AdvancedSearch: AdvancedSearchService,
    public SelectInputNumber:SelectInputNumberService,
    public SelectTagMultiple:SelectTagMultipleService,
    public platform: Platform,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data,
    public GamepadController: GamepadControllerService


  ) {
    if(data) {
      this.list=data.list;
      this.change=data.change;
      this.query_fixed=data.query_fixed;
    }


    GamepadEvent.registerAreaEvent("advanced_search_input", {
      A: e => {

        if (e.tagName == "BUTTON") {
          e.click()
          return
        }
        if (document.activeElement.tagName == "TEXTAREA") {
          e.querySelector("textarea").blur();
          this.WhenInputting.close();
        }
        this.WhenInputting.open();
        e.querySelector("textarea").focus();


      },

      B: e => {
        e.querySelector("textarea").blur();
        this.WhenInputting.close();
      }
    })
    GamepadEvent.registerAreaEvent('chip_option', {
      "LEFT": e => {
        this.GamepadController.setCurrentTarget("LEFT")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option] button") as any).focus()

          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          }, 20)
        }, 100)

      },
      "UP": (e) => {
        this.GamepadController.setCurrentTarget("UP")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option] button") as any).focus()

          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          }, 20)
        }, 100)
      },
      "DOWN": (e) => {
        this.GamepadController.setCurrentTarget("DOWN")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option] button") as any).focus()

          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          }, 20)
        }, 100)

      },
      "RIGHT": (e) => {
        this.GamepadController.setCurrentTarget("RIGHT")
        setTimeout(() => {
          (document.querySelector("[select=true][region=chip_option] button") as any).focus()
          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          }, 20)
        }, 100)
      },
      "A": (e) => {
        // console.log(document.querySelector("[select=true][region=chip_option] button"));

        setTimeout(() => {
          if (document.querySelector("[select=true][region=chip_option] button").getAttribute("aria-selected") == "true") {
            (document.querySelector("[select=true][region=chip_option] button") as any).click()
          } else {
            (document.querySelector("[select=true][region=chip_option] button") as any).click()
          }
          setTimeout(() => {
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          }, 20)
        }, 100)
      }
    })

    GamepadEvent.registerAreaEvent("advanced_search_slider", {
      A: async e => {


        if (e.getAttribute('type')=="slider") {
          const value=await this.SelectInputNumber.change({
            max:parseInt(e.getAttribute('max')),
            min:parseInt(e.getAttribute('min'))
          })
          if(value===null) return
          this.list[parseInt(e.getAttribute('index'))].value=value;
        }else{
          e.click()
          return
        }
      }
    })

    // SelectInputNumber
  }

  // radio_button_unchecked

  fixed() {
    let obj = {};
    for (let index = 0; index < this.list.length; index++) {
      const c = this.list[index]
      if (c.value) obj[c.id] = c.value
    }
    if (this.query_fixed) this.query_fixed(obj)
  }

  on() {
    let obj = {};
    for (let index = 0; index < this.list.length; index++) {
      const c = this.list[index]
      if (c.value) obj[c.id] = c.value
    }
    if (this.change) this.change(obj)
  }
  restart() {
    this.list.forEach(x => x.value = undefined)
  }

  openedChange(e) {
    if (e == true) {
      document.body.setAttribute("locked_region", "select")
    } else {
      if (document.body.getAttribute("locked_region") == "select") document.body.setAttribute("locked_region", document.body.getAttribute("router"))
      setTimeout(() => {
        (document.activeElement as any).blur()
      }, 0)
    }

  }
   on123=async (e)=>{
    const index=this.list.findIndex(x=>x.id==e.id)
    const arr=await this.SelectTagMultiple.change({
      list:e.options,
      name:e.label,
      value:this.list[index].value??[]
    });
    this.list[index].value=arr;
    if((window.innerWidth < 480 && (this.platform.ANDROID || this.platform.IOS))){
       (document.querySelector("#advanced_search")as any).click()
    }
  }
  focus() {
    this.WhenInputting.open();
  }
  blur() {
    this.WhenInputting.close();
  }
}
