import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output() valuesChange = new EventEmitter<any>();
  is_close = false;
  constructor() {
    this.value = this.values.toString();
  }

  input_change() {
    let value = this.value.split(" ").filter(x=>x);
    let arr = value.map((x: any) => parseFloat(x));
    if (value.length == 20 && !arr.includes(NaN)) {
      this.values = value.map((x: any) => parseFloat(x));
      if (this.change) this.change();
      this.valuesChange.emit(this.values as any);
    }
  }
  open() {
    this.is_close = true;
  }
  ngDoCheck() {
    this.value = this.values.join(" ");
    this.input_change();
  }
}
