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
<filter name="变灰" x="0%" y="0%" width="100%" height="100%">
<feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/>
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
    const nodes = doc.querySelectorAll("filter");
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const name = node.getAttribute("name") ?? "未命名";

      this.data.push({
        id:this.uuid2(10,10),
        name: name,
        innerHTML: text
      })
    }



  }
// 指定长度和基数
 uuid2(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}



}
