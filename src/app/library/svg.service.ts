import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  data: any = [];
  // 名称 dom


  constructor() {
    const arr = [
      {
        name: "灰度",
        value: [
          0.213, 0.715, 0.072, 0, 0,
          0.213, 0.715, 0.072, 0, 0,
          0.213, 0.715, 0.072, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "棕褐色",
        value: [
          0.393, 0.769, 0.189, 0, 0,
          0.349, 0.686, 0.168, 0, 0,
          0.272, 0.534, 0.131, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "布朗尼",
        value: [
          0.627, 0.320, 0.075, 0, 0,
          0.299, 0.587, 0.114, 0, 0,
          0.239, 0.469, 0.091, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "反转颜色",
        value: [
          -1, 0, 0, 0, 1,
          0, -1, 0, 0, 1,
          0, 0, -1, 0, 1,
          0, 0, 0, 1, 0
        ]
      },

      {
        name: "柯达胶卷",
        value: [
          1.15, 0.05, 0.05, 0, 0,
          0.05, 1.10, 0.05, 0, 0,
          0.05, 0.05, 1.10, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
      {
        name: "宝丽来",
        value: [
          0.3588, 0.7044, 0.1368, 0, 0,
          0.2990, 0.5870, 0.1140, 0, 0,
          0.2392, 0.4696, 0.0912, 0, 0,
          0, 0, 0, 1, 0
        ]
      },
    ]
    for (let index = 0; index < arr.length; index++) {
      const x = arr[index];
      this.register(`
        <svg>
        <filter name="${x.name}" x="0%" y="0%" width="100%" height="100%">
        <feColorMatrix type="matrix" values="${x.value.toString()}"/>
        </filter>
        </svg>
        `)
    }



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
  del(id) {
    const node = document.querySelector(`#${id}`);
    if (node) node.remove();
  }
  register(str) {
    console.log(str);

    const text = str;
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/html');
    const nodes = doc.querySelectorAll("filter");
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const name = node.getAttribute("name") ?? "未命名";

      this.data.push({
        id: this.uuid2(10, 10),
        name: name,
        innerHTML: text
      })
      console.log(this.data);

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
