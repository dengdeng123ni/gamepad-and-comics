import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ContextMenuEventService, DownloadService, GamepadControllerService, GamepadEventService, I18nService } from 'src/app/library/public-api';
import { ConfigDetailService } from '../../services/config.service';
import { CurrentDetailService } from '../../services/current.service';
import { GeneralService } from '../../services/general.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { ExportSettingsService } from '../export-settings/export-settings.service';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "Meta") this._ctrl = true;
    if (event.key == "Control") this._ctrl = true;
    if (event.key == "a") this.selectAll()
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Meta") this._ctrl = false;
    if (event.key == "Control") this._ctrl = false;
  }
  _ctrl = false;
  chapters = [];
  selectedList = [];
  afterInit$ = null;
  onDownloadClick$ = null;

  id = null;

  edit$ = null;
  title = "";
  constructor(
    public current: CurrentDetailService,
    public config: ConfigDetailService,
    public exportSettings: ExportSettingsService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService,
    public ContextMenuEvent: ContextMenuEventService,
    public download: DownloadService,
    public loading: LoadingService,
    public i18n: I18nService,
    public general:GeneralService,
    public doublePageThumbnail:DoublePageThumbnailService,
    public router: Router
  ) {
    GamepadEvent.registerAreaEvent("detail_toolabr_item", {
      B: () => {
        this.closeEdit();
      }
    })
    GamepadEvent.registerAreaEvent("section_item", {
      B: () => {
        if(config.edit){
          this.closeEdit();
        }else{
          this.router.navigate(['/'])
        }

      }
    })
    ContextMenuEvent.register('section_item', {
      close: e => {

      },
      on: async e => {
        let selectedList = [];
        if (this.selectedList.length) {
          selectedList = this.selectedList;
        } else {
          const id = parseInt(e.value);
          selectedList = this.current.comics.chapters.filter(x => x.id == id);
        }
        if (e.id == "delete") {
          const ids = selectedList.map(x => x.id)
          this.current.deleteChapter(ids)
        }else  if (e.id == "thumbnail") {
      const id=parseInt(e.value);
      const index = await this.general.getChapterIndex(id);
      this.doublePageThumbnail.open({
        id: id,
        index: index
      })

        }
        else if (e.id == "export") {
          const ids = selectedList.map(x => x.id)
          ids.forEach(id => { let obj = this.chapters.find(s => s.id == id); obj.selected = true; })

          const node = document.getElementById("menu_content");
          let { x, y, width, height } = node.getBoundingClientRect();
          if (window.innerWidth < (x + 262)) x = window.innerWidth - 262
          if (window.innerHeight < (y + 212)) y = window.innerHeight - 212
          this.exportSettings.open({
            position: {
              top: `${y}px`,
              left: `${x}px`
            },
            delayFocusTrap: false,
            panelClass: "reader_settings_buttom",
            backdropClass: "reader_settings_buttom_backdrop"
          })
        }
      },
      menu: [
        { name: "thumbnail", id: "thumbnail" },
        { name: "export", id: "export" },
        { name: "delete", id: "delete" },
      ]
    })

    this.afterInit$ = this.current.afterInit().subscribe((comics: any) => {
      this.chapters = this.current.comics.chapters;
      this.title = this.current.comics.chapter.title;
      this.id = this.current.comics.chapter.id;
      setTimeout(() => {
        const node = document.getElementById(`${this.current.comics.chapter.id}`)
        node.scrollIntoView({ block: "center", inline: "center" })
      })
    })
    this.onDownloadClick$ = this.current.onDownloadClick().subscribe(async (x) => {
      const { $event, data } = x;
      const isFirstPageCover = data.isFirstPageCover;
      const type = data.type;
      const page = data.page;
      const pageOrder = data.pageOrder;
      this.loading.open();
      if (type == "PDF") {
        if (page == "one") await this.download.pdf({ name: this.current.comics.title, chapters: this.selectedList, page })
        else await this.download.pdf({ name: this.current.comics.title, isFirstPageCover, pageOrder, chapters: this.selectedList, page });
      }
      if (type == "PPT") {
        if (page == "one") await this.download.ppt({ name: this.current.comics.title, chapters: this.selectedList, page })
        else await this.download.ppt({ name: this.current.comics.title, isFirstPageCover, pageOrder, chapters: this.selectedList, page });
      }
      if (type == "ZIP") {
        if (page == "one") await this.download.zip({ name: this.current.comics.title, chapters: this.selectedList, page })
        else await this.download.zip({ name: this.current.comics.title, isFirstPageCover, pageOrder, chapters: this.selectedList, page });
      }

      if (type == "EPUB") {
        if (page == "one") await this.download.epub({ name: this.current.comics.title, chapters: this.selectedList, page })
        else await this.download.epub({ name: this.current.comics.title, isFirstPageCover, pageOrder, chapters: this.selectedList, page });
      }

      this.loading.close();
      this.chapters.forEach(x => x.selected = false)
    })

    this.edit$ = this.current.edit().subscribe(x => {
      if (x) {
        setTimeout(()=>{
          GamepadController.setCurrentTargetId('select_all')
        })
      } else {
        this.close()
      }
    })
  }
  closeEdit() {
    this.config.edit = !this.config.edit;
    this.current.edit$.next(this.config.edit);
    setTimeout(() => {
      this.GamepadController.setCurrentTargetId("list_side_edit");
    }, 50)
  }
  ngOnDestroy() {
    this.afterInit$.unsubscribe();
    this.onDownloadClick$.unsubscribe();
    this.edit$.unsubscribe();
    if (this.config.edit) this.closeEdit();
  }
  ngDoCheck(): void {
    this.selectedList = this.chapters.filter(x => x.selected == true)
  }
  on($event, data) {
    if (this.config.edit) {
      let obj = this.chapters.find(s => s.id == data.id);
      obj.selected = !obj.selected;
    }
    if (this.config.edit) return
    if (this._ctrl) {
      let obj = this.chapters.find(s => s.id == data.id);
      obj.selected = !obj.selected;
    }
    if (this._ctrl) return
    this.current.router_reader_page(data);
  }
  close() {
    if (this.config.edit) return
    if (this._ctrl) return
    this.chapters.forEach(x => x.selected = false)
  }
  selectAll() {
    if (!this._ctrl && !this.config.edit) return
    const bool = this.chapters.filter(x => x.selected == true).length == this.chapters.length;
    if (bool) {
      this.chapters.forEach(x => x.selected = false)
    } else {
      this.chapters.forEach(x => x.selected = true)
    }
  }
  selectedDetele() {
    const ids = this.selectedList.map(x => x.id)
    this.current.deleteChapter(ids)
  }
  openDownload($event) {
    let { x, y, width, height } = $event.target.getBoundingClientRect();
    x = x - (228 / 2) + (width / 2);
    y = (y + (height) + 5);
    this.exportSettings.open({
      position: {
        top: `${y}px`,
        left: `${x}px`
      },
      delayFocusTrap: false,
      panelClass: "reader_settings_buttom",
      backdropClass: "reader_settings_buttom_backdrop"
    })
  }



  back() {
    this.router.navigate(['/'])
  }
  continue(e) {
    this.router.navigate(['/reader', this.current.comics.id])
  }
  ngAfterViewInit() {

  }
}
