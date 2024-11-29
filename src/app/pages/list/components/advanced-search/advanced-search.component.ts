import { Component, Input } from '@angular/core';
import { GamepadControllerService, GamepadEventService } from 'src/app/library/public-api';
import { WhenInputtingService } from '../when-inputting/when-inputting.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent {

  @Input() list: Array<any> = [];
  @Input() change: Function;

  constructor(public GamepadEvent:GamepadEventService,
    public WhenInputting:WhenInputtingService,
    public GamepadController:GamepadControllerService


  ){
    GamepadEvent.registerAreaEvent("advanced_search_input", {
      A: e => {

        if(e.tagName=="BUTTON"){
           e.click()
           return
        }
        if(document.activeElement.tagName=="TEXTAREA"){
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
    GamepadEvent.registerAreaEvent('chip_option',{
      "LEFT": e => {
         this.GamepadController.setCurrentTarget("LEFT")
        setTimeout(()=>{
         (document.querySelector("[select=true][region=chip_option] button") as any).focus()

         setTimeout(()=>{
          (document.querySelector("[select=true][region=chip_option] button") as any).blur()
        },20)
        },100)

       },
       "UP": (e) => {
         this.GamepadController.setCurrentTarget("UP")
         setTimeout(()=>{
           (document.querySelector("[select=true][region=chip_option] button") as any).focus()

           setTimeout(()=>{
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          },20)
          },100)
       },
       "DOWN": (e) => {
         this.GamepadController.setCurrentTarget("DOWN")
         setTimeout(()=>{
           (document.querySelector("[select=true][region=chip_option] button") as any).focus()

          setTimeout(()=>{
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          },20)
          },100)

       },
       "RIGHT": (e) => {
         this.GamepadController.setCurrentTarget("RIGHT")
         setTimeout(()=>{
           (document.querySelector("[select=true][region=chip_option] button") as any).focus()
           setTimeout(()=>{
            (document.querySelector("[select=true][region=chip_option] button") as any).blur()
          },20)
          },100)
       },
       "A":(e) => {
        // console.log(document.querySelector("[select=true][region=chip_option] button"));

        setTimeout(()=>{
          if(document.querySelector("[select=true][region=chip_option] button").getAttribute("aria-selected")=="true"){

          }else{
            (document.querySelector("[select=true][region=chip_option] button") as any).click()
          }

         },100)
       }
     })
  }


  on() {
    let obj = {};
    for (let index = 0; index < this.list.length; index++) {
      const c = this.list[index]
      if (c.value) obj[c.id] = c.value
    }
    this.change(obj)


  }
  restart(){
    this.list.forEach(x=>x.value=undefined)
  }

  openedChange(e) {
    if (e == true) {
      document.body.setAttribute("locked_region", "select")
    } else {
      if (document.body.getAttribute("locked_region") == "select") document.body.setAttribute("locked_region", document.body.getAttribute("router"))
      setTimeout(() => {
       ( document.activeElement as any).blur()
      }, 0)
    }

  }

  focus(){
    this.WhenInputting.open();
  }
  blur(){
    this.WhenInputting.close();
  }
}
