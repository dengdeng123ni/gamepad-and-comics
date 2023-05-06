import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from 'src/app/library/public-api';
import { CurrentReaderService } from './current.service';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(
    public current: CurrentReaderService,
    private _snackBar: MatSnackBar,
    public i18n: I18nService
  ) {
    current.chapterNext$.subscribe(x => {
      if (document.body.getAttribute('locked_region') == "reader_navbar_bar") return
      this.chapterPrompt(x.title)
    })
    current.chapterPrevious$.subscribe(x => {
      if (document.body.getAttribute('locked_region') == "reader_navbar_bar") return
      this.chapterPrompt(x.title)
    })
    current.pageLastAfter$.subscribe(() => {
      if (document.body.getAttribute('locked_region') == "reader_navbar_bar") return
      this.endPrompt();
    })
    current.pageFirstBefore$.subscribe(() => {
      if (document.body.getAttribute('locked_region') == "reader_navbar_bar") return
      this.firstPrompt();
    })
    current.chapterFirstBefore$.subscribe(() => {
      if (document.body.getAttribute('locked_region') == "reader_navbar_bar") return
      this._snackBar.open(i18n.config.first_chapter, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'start', verticalPosition: 'top', });
    })
    current.chapterLastAfter$.subscribe(() => {
      if (document.body.getAttribute('locked_region') == "reader_navbar_bar") return
      this._snackBar.open(i18n.config.last_chapter, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
    })
  }

  chapterPrompt(data) {
    this._snackBar.open(data, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
  }

  endPrompt() {
    this._snackBar.open(this.i18n.config.last_page, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
  }

  firstPrompt() {
    this._snackBar.open(this.i18n.config.first_page, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'start', verticalPosition: 'top', });
  }

}
