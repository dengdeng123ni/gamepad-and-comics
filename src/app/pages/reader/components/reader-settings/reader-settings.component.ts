import { Component } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';

@Component({
  selector: 'app-reader-settings',
  templateUrl: './reader-settings.component.html',
  styleUrls: ['./reader-settings.component.scss']
})
export class ReaderSettingsComponent {
  constructor(
    public current: CurrentReaderService,
    public config: ConfigReaderService,
    public i18n:I18nService
  ) {
  }
  modeChange() {
    if (this.current.comics.mode != 4) this.current.mode$.next(this.current.comics.mode + 1)
    else this.current.mode$.next(1)
  }
  slidingDirection() {
    this.config.mode1.slidingDirection == 'horizontal' ? this.config.mode1.slidingDirection = 'vertical' : this.config.mode1.slidingDirection = 'horizontal'

  }
  changeSpreadMatch() {
    this.current.switch$.next("");
  }
  firstPageCoverChange() {
    this.current.comics.isFirstPageCover = !this.current.comics.isFirstPageCover;
    if (this.current.comics.chapter.index == 0) {
      this.changeSpreadMatch();
      this.changeSpreadMatch();
    }else{
      this.current.update_state(this.current.comics.chapter,this.current.comics.chapter.index)
    }

  }
  isPageTurnDirection(){
    if(this.config.mode1.slidingDirection == 'horizontal'&&this.config.mode1.isPageTurnDirection){
      this.config.mode1.isPageTurnDirection=false;
      this.config.mode1.slidingDirection = 'horizontal'
      if(this.config.mode==1){
        this.config.mode=6;
        setTimeout(()=>{
          this.current.mode$.next(1)
          this.current.pageChange(this.current.comics.chapter.index)
        })
       }
    }else if(this.config.mode1.slidingDirection == 'horizontal'&&!this.config.mode1.isPageTurnDirection){
      this.config.mode1.isPageTurnDirection=true;
      this.config.mode1.slidingDirection = 'vertical'
      if(this.config.mode==1){
        this.config.mode=6;
        setTimeout(()=>{
          this.current.mode$.next(1)
          this.current.pageChange(this.current.comics.chapter.index)
        })
       }
    }else if(this.config.mode1.slidingDirection == 'vertical'&&this.config.mode1.isPageTurnDirection){
      this.config.mode1.slidingDirection = 'horizontal'
      this.config.mode1.isPageTurnDirection=true;
      if(this.config.mode==1){
        this.config.mode=6;
        setTimeout(()=>{
          this.current.mode$.next(1)
          this.current.pageChange(this.current.comics.chapter.index)
        })
       }
    }


  }
  pageOrder(){
    this.current.comics.pageOrder=!this.current.comics.pageOrder;
    this.current.pageChange(this.current.comics.chapter.index)
  }
  isPageTurnDirection3(){
    this.config.mode3.isPageTurnDirection=!this.config.mode3.isPageTurnDirection;
  }
  slidingDirection4() {
    this.config.mode4.slidingDirection == 'horizontal' ? this.config.mode4.slidingDirection = 'vertical' : this.config.mode4.slidingDirection = 'horizontal'
    if(this.config.mode==4){
      this.config.mode=6;
      setTimeout(()=>this.current.mode$.next(4))
     }
  }
  isPageTurnDirection4(){
    if(this.config.mode4.slidingDirection == 'horizontal'&&this.config.mode4.isPageTurnDirection){
      this.config.mode4.isPageTurnDirection=false;
      this.config.mode4.slidingDirection = 'horizontal'
      if(this.config.mode==4){
        this.config.mode=7;
        setTimeout(()=>{
          this.current.mode$.next(4)
          this.current.pageChange(this.current.comics.chapter.index)
        })
       }
    }else if(this.config.mode4.slidingDirection == 'horizontal'&&!this.config.mode4.isPageTurnDirection){
      this.config.mode4.isPageTurnDirection=true;
      this.config.mode4.slidingDirection = 'vertical'
      if(this.config.mode==4){
        this.config.mode=7;
        setTimeout(()=>{
          this.current.mode$.next(4)
          this.current.pageChange(this.current.comics.chapter.index)
        })
       }
    }else if(this.config.mode4.slidingDirection == 'vertical'&&this.config.mode4.isPageTurnDirection){
      this.config.mode4.slidingDirection = 'horizontal'
      this.config.mode4.isPageTurnDirection=true;
      if(this.config.mode==4){
        this.config.mode=7;
        setTimeout(()=>{
          this.current.mode$.next(4)
          this.current.pageChange(this.current.comics.chapter.index)
        })
       }
    }
  }

  ngOnDestroy(){
    this.current.update_state(this.current.comics.chapter,this.current.comics.chapter.index)
     this.config.save();
     this.current.readerNavbarBar$.next(false)

  }
}
