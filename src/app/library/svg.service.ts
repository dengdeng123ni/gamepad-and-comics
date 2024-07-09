import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  data: any = [];
  // 名称 dom


  constructor() {
    this.register(`
    <svg>
<filter name="变红" id="page" x="0%" y="0%" width="100%" height="100%">
  <feColorMatrix result="original" id="c1" type="matrix" values="1 -0.4 1.3 1.5 -0.3 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
</filter>
</svg>
`)
  }

  init() {
  }
  add(target, id, node = document.body) {
    const obj = this.data.find(x => x.name == target);
    const text = obj.innerHTML;
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/html').querySelector("filter");
    doc.setAttribute("id", id)
    node.appendChild(doc)
  }
  add2(text, id, node = document.body) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/html').querySelector("filter");
    doc.setAttribute("id", id)
    node.appendChild(doc)
  }
  del(id){
    const node=document.querySelector(`#${id}`);
    if(node) node.remove();
  }
  register(str) {
    const text = str;
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/html');
    const node = doc.querySelector("filter");
    const name = node.getAttribute("name") ?? "未命名";

    this.data.push({
      name: name,
      innerHTML: text
    })

  }



}
