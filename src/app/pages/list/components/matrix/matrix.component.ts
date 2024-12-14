import { Component, EventEmitter, Input, Output } from '@angular/core';


import { WhenInputtingService } from '../when-inputting/when-inputting.service';
import { IndexdbControllerService, PromptService } from 'src/app/library/public-api';

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
  constructor(public webDb: IndexdbControllerService,
    public prompt:PromptService,
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
    const name = await this.prompt.fire("请输入新名称", "");

    if (name === null) {

    } else if (name === "") {
      const generateRandomName = (length = 4) => {
        const chars = '1234567890';
        let name = '';
        for (let i = 0; i < length; i++) {
          name += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return name;
      }
      const name= generateRandomName()
      const obj={
        id: `_${new Date().getTime()}`,
        name: name,
        value: this.values
      }
      await this.webDb.update('color_matrix', obj)
      this.save(obj)
    }else{
      if (name !== null) {
        if (name != "") {
          const obj={
            id: `_${new Date().getTime()}`,
            name: name,
            value: this.values
          }
          await this.webDb.update('color_matrix', obj)
          this.save(obj)
        }
      } else {

      }
    }

  }
}
