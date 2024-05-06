import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from 'src/app/library/public-api';
import { CurrentService } from './current.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(
    public current: CurrentService,
    public data: DataService,
    private _snackBar: MatSnackBar,
    public i18n: I18nService
  ) {
    current.pageStatu$.subscribe(x => {
      // if (document.body.getAttribute('locked_region') == "reader_navbar_bar") return
      if (x == "page_first") this._snackBar.open("第一页", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'start', verticalPosition: 'top', });
      if (x == "page_last") this._snackBar.open("最后一页", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
      if (x == "chapter_first") this._snackBar.open("第一章", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'start', verticalPosition: 'top', });
      if (x == "chapter_last") this._snackBar.open("最终章", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
      if (x == "chapter") {
        const obj = this.data.chapters.find(x => x.id == this.data.chapter_id)
        if (obj) this._snackBar.open(obj.title, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
      }
      if (x == "page") {
        // this._snackBar.open(`页码: ${this.data.page_index+1} / ${this.data.pages.length}`, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
      }
    })
  }

  chapterPrompt(data) {
    this._snackBar.open(data, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
  }

  endPrompt() {
    this._snackBar.open(this.i18n.config.last_page, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
  }

  firstPrompt() {

  }

}
