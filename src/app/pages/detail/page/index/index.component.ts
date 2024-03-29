import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { GamepadEventService } from 'src/app/library/public-api';
import { DoublePageThumbnailService } from '../../components/double-page-thumbnail/double-page-thumbnail.service';
import { GamepadThumbnailService } from '../../components/gamepad-thumbnail/gamepad-thumbnail.service';
import { GamepadLeftCircleToolbarService } from '../../components/gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.service';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';
import { OnePageThumbnailService } from '../../components/one-page-thumbnail/one-page-thumbnail.service';

@Component({
  selector: 'app-info-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexDetailComponent {
  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if (document.body.getAttribute("locked_region") != "detail") return
    if (event.code == "Escape") window.history.back()

    if(event.code=="Enter"){
      if(document.activeElement==document.body){
        this.router.navigate(['/reader', this.current.comics.id])
      }
    }
    // if
    //
  }
  constructor
    (
      public current: CurrentDetailService,
      public config: ConfigDetailService,
      private route: ActivatedRoute,
      public router:Router,
      public GamepadEvent: GamepadEventService,
      public GamepadLeftCircleToolbar: GamepadLeftCircleToolbarService,
      public gamepadThumbnail: GamepadThumbnailService,
      public doublePageThumbnail: DoublePageThumbnailService,
      public onePageThumbnail:OnePageThumbnailService,
      public general: GeneralService
    ) {

    GamepadEvent.registerConfig("detail", { region: ["back","continue","detail_toolabr_item","section_item"] })
    document.body.setAttribute("locked_region","detail")
    GamepadEvent.registerGlobalEvent({
      "LEFT_ANALOG_PRESS": () => {
        this.GamepadLeftCircleToolbar.isToggle();
      },
    })
    GamepadEvent.registerAreaEventY("section_item", {
      "LEFT": async $event => {
        const id = parseInt($event.getAttribute("id"))
        const index = await this.general.getChapterIndex(id);
        this.gamepadThumbnail.open({
          id: id,
          index: index
        })
      },
      "RIGHT": async $event => {
        const id = parseInt($event.getAttribute("id"))
        const index = await this.general.getChapterIndex(id);
        this.doublePageThumbnail.open({
          id: id,
          index: index
        })
      },
    })
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    id$.subscribe(x => this.current.init(x))

  }
  ngOnDestroy() {
    this.current.close();
  }
}
