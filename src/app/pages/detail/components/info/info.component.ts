import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { CurrentDetailService } from '../../services/current.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  @HostListener('window:resize', ['$event'])
  resize() {
    this.width=window.innerWidth;
  }
  comics:any = {
    cover:{
      src:""
    },
    title:"",
    chapter:{
      title:""
    },
    chapters:[{}]
  };

  isFirst=false;
  width=window.innerWidth;


  constructor(
    public current: CurrentDetailService,
    public router: Router,
    public GamepadEvent: GamepadEventService,
    public GamepadController:GamepadControllerService,
    public i18n:I18nService,
    public breakpointObserver: BreakpointObserver
  ) {
    GamepadEvent.registerAreaEvent('continue', {
      DOWN: () => {
       if(this.isFirst){
        this.GamepadController.setCurrentTargetId(`section_item_${this.current.comics.chapter.id}`);
        this.isFirst=false;
       } else{
        this.GamepadController.setCurrentTarget("DOWN")
       }
      },
      RIGHT:()=>{
        if(this.isFirst){
          this.GamepadController.setCurrentTargetId(`section_item_${this.current.comics.chapter.id}`);
          this.isFirst=false;
         } else{
          this.GamepadController.setCurrentTarget("RIGHT")
         }
      },
      B: () => {
        this.router.navigate(['/'])
      },

    })
    GamepadEvent.registerAreaEvent('back', {
      B: () => {
        this.router.navigate(['/'])
      },
      DOWN:()=>{
        if(this.isFirst){
          this.GamepadController.setCurrentTargetId(`section_item_${this.current.comics.chapter.id}`);
          this.isFirst=false;
         } else{
          this.GamepadController.setCurrentTarget("DOWN")
         }
      },

    })
    this.current.afterInit$.subscribe((comics:any) => {
      this.comics = this.current.comics
    })

  }
  back() {
    this.router.navigate(['/'])
  }
  continue(e) {
    this.router.navigate(['/reader', this.comics.id])
  }
}
