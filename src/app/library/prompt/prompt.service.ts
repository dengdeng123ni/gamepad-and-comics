import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptComponent } from './prompt.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {


  opened = false;
  dialogRef
  value = "";
  constructor(
    public _dialog: MatDialog,
  ) {

  }
  async init(){
    const res=await this.fire("2313");
  }

  fire=async (name, value?):Promise<string>=> {
    // const res=window.prompt(name, value??'')
    // return res
    if (this.opened == false) {
      this.opened = true;
      this.dialogRef = this._dialog.open(PromptComponent, {
        panelClass: "_prompt",
        data: {
          name: name,
          value: value??'',
          save: (value1) => {
            this.opened = false;
            this.value = value1;
          },
          close: () => {
            this.dialogRef.close()
          }
        },
        position: {
          top: "0"
        }
      });
      document.body.setAttribute("locked_region", "prompt")
      document.body.setAttribute("onkeyboard", "true")

      this.dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "prompt" && this.opened) document.body.setAttribute("locked_region", document.body.getAttribute("router"))
        document.body.setAttribute("onkeyboard", "false")
        this.opened = false;
      });
    }
    return new Promise((r, j) => {
      const _f = () => {
        setTimeout(() => {
          if (!this.opened) {
            r(this.value)
            this.dialogRef.close()
          } else {
            _f();
          }
        }, 66)
      }
      _f();
    })
  }






}
