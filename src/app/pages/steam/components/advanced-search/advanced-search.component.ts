import { Component, HostListener, Inject, Input, Optional } from '@angular/core';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { AdvancedSearchService } from './advanced-search.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SelectInputNumberService } from '../select-input-number/select-input-number.service';
import { SelectTagMultipleService } from '../select-tag-multiple/select-tag-multiple.service';
import { Platform } from '@angular/cdk/platform';
import { FormGroup, FormControl } from '@angular/forms';
import { SelectTimeRangeService } from '../select-time-range/select-time-range.service';
import { SelectTimeService } from '../select-time/select-time.service';
import { WhenInputtingService } from '../when-inputting/when-inputting.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent {
  dateRange = {
    start: null, // 开始日期
    end: null,   // 结束日期
  };

  @HostListener('window:click', ['$event'])
  onClickKey = (event: PointerEvent) => {
    if (document.activeElement.tagName == "BUTTON") {
      const node = document?.activeElement?.parentNode?.parentNode;

      if (node) {
        let type = (node as any)?.getAttribute('type')
        if (type == "chip") {
          setTimeout(() => {
            (document.activeElement as any).blur()
          }, 20)
        }
      }
    }



  }
  @Input() list: Array<any> = [];
  @Input() change: Function;
  @Input() query_fixed: Function;

  constructor(public GamepadEvent: GamepadEventService,
    public WhenInputting: WhenInputtingService,
    public AdvancedSearch: AdvancedSearchService,
    public SelectInputNumber: SelectInputNumberService,
    public SelectTagMultiple: SelectTagMultipleService,
    public SelectTime:SelectTimeService,
    public SelectTimeRange:SelectTimeRangeService,
    public platform: Platform,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data,
    public GamepadController: GamepadControllerService


  ) {
    if (data) {
      this.list = data.list;
      this.change = data.change;
      this.query_fixed = data.query_fixed;
    }


    // const pattern=document.body.getAttribute('pattern')
    // if(pattern=="gamepad"){
    //   document.get
    // }

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


        if (e.getAttribute('type') == "slider") {
          const value = await this.SelectInputNumber.change({
            max: parseInt(e.getAttribute('max')),
            min: parseInt(e.getAttribute('min'))
          })
          if (value === null) return
          this.list[parseInt(e.getAttribute('index'))].value = value;
        } else {
          e.click()
          return
        }
      }
    })
    GamepadEvent.registerAreaEvent("advanced_search_item", {
      A: async e => {
        if (e.getAttribute('type') == "time_range") {
          let start= e.querySelector("[start=true]").getAttribute("value")
          if(start) start= new Date(start).getTime();

          let end= e.querySelector("[end=true]").getAttribute("value")
          if(end) end= new Date(end).getTime();
          let res=  await this.SelectTimeRange.change({
            name:this.list[parseInt(e.getAttribute('index'))].name,
            data:[start,end]
          })
          if(res){
           if(res[0]) this.list[parseInt(e.getAttribute('index'))].start = res[0];
           if(res[1]) this.list[parseInt(e.getAttribute('index'))].end = res[1];
          }
        }else if(e.getAttribute('type') == "time"){
          let date= e.querySelector("[date=true]").getAttribute("value")
          if(date) date= new Date(date).getTime();
          let res=  await this.SelectTime.change({
            name:this.list[parseInt(e.getAttribute('index'))].name,
            data:date
          })
          if(res){
            this.list[parseInt(e.getAttribute('index'))].date = res;
           }
        } else {
          this.GamepadController.leftKey();
          return
        }
      }
    })

    // SelectInputNumber
  }

  ngOnInit(): void {

  }

  fixed() {
    let obj = {};
    for (let index = 0; index < this.list.length; index++) {
      const c = this.list[index]
      if (c.type == "time_range") {
        if (c.start && c.end) c.value = { start: c.start.getTime(), end: c.end.getTime() }
        else c.value = null
      }
      if (c.type == "time") {
        if (c.date) c.value = c.date.getTime()
        else c.value = null
      }

      if (c.value) obj[c.id] = c.value
    }
    if (this.query_fixed) this.query_fixed(obj)
  }

  on() {
    let obj = {};
    for (let index = 0; index < this.list.length; index++) {
      const c = this.list[index]
      if (c.type == "time_range") {
        if (c.start && c.end) c.value = { start: c.start.getTime(), end: c.end.getTime() }
        else c.value = null
      }
      if (c.type == "time") {
        if (c.date) c.value = c.date.getTime()
        else c.value = null
      }





      if (c.value) obj[c.id] = c.value;
    }
    if (this.change) this.change(obj)
  }
  restart() {
    this.list.forEach(x =>{
      x.value = undefined;
      x.start= undefined;
      x.end= undefined;
      x.date= undefined;
    })
  }
  old_value = ""
  openedChange(e, value) {
    if (e == true) {
      document.body.setAttribute("locked_region", "select")
      if (value) this.old_value = value;
    } else {
      if (document.body.getAttribute("locked_region") == "select") document.body.setAttribute("locked_region", document.body.getAttribute("router"))
      setTimeout(() => {
        (document.activeElement as any).blur()
      }, 0)
    }

  }
  on12321(e, n, $event) {

    if (e.value) {
      const index = this.list.findIndex(x => x.id == e.id)
      if ($event.target.getAttribute("aria-selected") == "true") {
        if (this.old_value == this.list[index].value) this.list[index].value = null;
      }
    }



  }



  on123 = async (e) => {
    const index = this.list.findIndex(x => x.id == e.id)

    const arr = await this.SelectTagMultiple.change({
      list: e.options,
      name: e.name,
      value: this.list[index].value ?? []
    });
    this.list[index].value = arr;
    if ((window.innerWidth < 480 && (this.platform.ANDROID || this.platform.IOS))) {
      (document.querySelector("#advanced_search") as any).click()
    }
  }
  focus() {
    this.WhenInputting.open();
  }
  blur() {
    this.WhenInputting.close();
  }
}
