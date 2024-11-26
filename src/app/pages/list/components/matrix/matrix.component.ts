import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { WhenInputtingService } from '../when-inputting/when-inputting.service';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrl: './matrix.component.scss'
})
export class MatrixComponent {
  value = ""
  // values = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
  @Input() values: Array<number> = [];
  @Input() change: Function;
  @Input() save: Function;
  @Output() valuesChange = new EventEmitter<any>();
  is_close = false;
  constructor(public webDb: NgxIndexedDBService,
    public WhenInputting:WhenInputtingService,) {
    this.value = this.values.toString();
  }

  input_change() {
    let value = this.value.split(" ").filter(x => x);
    let arr = value.map((x: any) => parseFloat(x));
    if (value.length == 20 && !arr.includes(NaN)) {
      this.values = value.map((x: any) => parseFloat(x));
      if (this.change) this.change();
      this.valuesChange.emit(this.values as any);
    }
  }
  focus(){
    this.WhenInputting.open();
  }
  blur(){
    this.WhenInputting.close();
  }
  open() {

    this.is_close = true;
    setTimeout(()=>{
      (document.querySelector("#input_v123") as any).focus()
    },30)
  }
  ngDoCheck() {
    this.value = this.values.join(" ");
    this.input_change();
  }
  async on() {
    const userInput = prompt("请输入新名称", "");
    if (userInput !== null) {
      if (userInput != "") {
        const obj={
          id: `_${new Date().getTime()}`,
          name: userInput,
          value: this.values
        }
        await firstValueFrom(this.webDb.update('color_matrix', obj))
        this.save(obj)
      }
    } else {

    }
  }
}
