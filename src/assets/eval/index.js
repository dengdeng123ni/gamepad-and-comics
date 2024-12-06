class MessageFetchService {
  _data_proxy_response = {};
  _data_proxy_request = {};
  constructor() {
      window.electron.receiveMessage('message-from-main', (event, message) => {
          if (message.type == "proxy_response") {
              let rsponse = message.data;
              const blob = new Blob([rsponse.body]);
              delete rsponse.body;
              const headers = new Headers();
              rsponse.headers.forEach((x) => {
                headers.append(x.name, x.value);
              })
              rsponse.headers = headers;

              this._data_proxy_response[message.id]= new Response(blob, rsponse)

              setTimeout(()=>{
                this._data_proxy_response[message.id]=undefined;
                this._data_proxy_request[message.id]=undefined;
              },40000)
            }else if(message.type=="execute_script_data"){
              this._data_proxy_response[message.id]= message.data;
              setTimeout(()=>{
                this._data_proxy_response[message.id]=undefined;
              },40000)
            }else if(message.type=="proxy_data"){
              this._data_proxy_response[message.id]= message.data;
              setTimeout(()=>{
                this._data_proxy_response[message.id]=undefined;
              },40000)
            }

      });

      window._gh_fetch = this.fetch;
      window._gh_get_html = this.getHtml;
      window._gh_execute_eval = this.execute_eval;
  }

  postMessage = (data) => {
      window.electron.sendMessage('message-from-renderer', data);
  }
  // MD5 Hash Implementation
  MD5(message) {
      // 常量（来自MD5标准算法）
      const K = [
          0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
          0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
          0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
          0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
          0x0f93a7fa, 0x0e3f5d21, 0x6b7c5342, 0x2d8976d8
      ];

      const S = [
          7, 12, 17, 22,
          5, 9, 14, 20,
          4, 11, 16, 23,
          6, 10, 15, 21
      ];

      const F = (x, y, z) => (x & y) | (~x & z);
      const G = (x, y, z) => (x & z) | (y & ~z);
      const H = (x, y, z) => x ^ y ^ z;
      const I = (x, y, z) => y ^ (x | ~z);

      // 填充输入信息，使其长度是64位的倍数
      function padding(message) {
          const bitLength = message.length * 8;
          message += String.fromCharCode(0x80); // 添加 0x80
          while (message.length % 64 !== 56) {
              message += String.fromCharCode(0); // 填充 0
          }

          // 追加 bitLength
          message += String.fromCharCode(0, 0, 0, 0, 0, 0, 0, 0);
          message = message.slice(0, -8); // 剔除多余的最后8个字节
          for (let i = 0; i < 8; i++) {
              message += String.fromCharCode((bitLength >> (i * 8)) & 0xFF);
          }

          return message;
      }

      // 位运算：将字符串转换为数组
      function toWords(message) {
          const words = [];
          for (let i = 0; i < message.length; i++) {
              words[i >> 2] |= message.charCodeAt(i) << ((i % 4) * 8);
          }
          return words;
      }

      // MD5压缩算法
      function transform(A, B, C, D, X) {
          let AA = A, BB = B, CC = C, DD = D;

          for (let i = 0; i < 64; i++) {
              let div16 = Math.floor(i / 16);
              let temp;

              if (div16 === 0) {
                  temp = F(B, C, D);
                  temp = (temp + A + X[i] + K[i]) << S[i % 4] | ((temp + A + X[i] + K[i]) >>> (32 - S[i % 4]));
                  A = D; D = C; C = B; B = temp;
              } else if (div16 === 1) {
                  temp = G(B, C, D);
                  temp = (temp + A + X[i] + K[i]) << S[i % 4] | ((temp + A + X[i] + K[i]) >>> (32 - S[i % 4]));
                  A = D; D = C; C = B; B = temp;
              } else if (div16 === 2) {
                  temp = H(B, C, D);
                  temp = (temp + A + X[i] + K[i]) << S[i % 4] | ((temp + A + X[i] + K[i]) >>> (32 - S[i % 4]));
                  A = D; D = C; C = B; B = temp;
              } else {
                  temp = I(B, C, D);
                  temp = (temp + A + X[i] + K[i]) << S[i % 4] | ((temp + A + X[i] + K[i]) >>> (32 - S[i % 4]));
                  A = D; D = C; C = B; B = temp;
              }
          }

          A += AA; B += BB; C += CC; D += DD;

          return [A, B, C, D];
      }

      // 主函数，生成 MD5 哈希
      function createMD5(message) {
          const paddedMessage = padding(message);
          const words = toWords(paddedMessage);

          let A = 0x67452301, B = 0xefcdab89, C = 0x98badcfe, D = 0x10325476;

          // 每次处理 512 位的块
          for (let i = 0; i < words.length; i += 16) {
              const block = words.slice(i, i + 16);
              [A, B, C, D] = transform(A, B, C, D, block);
          }

          // 输出哈希值
          const result = [A, B, C, D].map(function (x) {
              return ('00000000' + (x >>> 0).toString(16)).slice(-8);
          }).join('');

          return result;
      }

      // 返回 MD5 的哈希值
      return createMD5(message);
  }


  fetch = async (url, init) => {
      if (!init) {
          init = {
              "headers": {
              },
              "body": null,
              "method": "GET"
          }
      }

      const req = new Request(url, init);
      let body = null;
      if (req.body) body = await this.readStreamToString(req.body)
      const b64_to_utf8 = (str) => {
          return JSON.parse(decodeURIComponent(escape(window.atob(str))));
      }
      let id = ''
      let bool = true;
      if (init && (init).proxy) {

          id = window.CryptoJS.MD5(JSON.stringify({
              type: "website_proxy_request",
              proxy_request_website_url: (init).proxy,
              proxy_response_website_url: window.location.origin,
              http: {
                  url: url,
                  option: {
                      "headers": init.headers,
                      "body": body,
                      "method": init.method
                  }
              }
          })).toString().toLowerCase()
          if (!this._data_proxy_request[id]) {
              this._data_proxy_request[id] = true;
              const send = () => {
                  this.postMessage({
                      id: id,
                      type: "website_proxy_request",
                      proxy_request_website_url: (init).proxy,
                      proxy_response_website_url: window.location.origin,
                      http: {
                          url: url,
                          option: {
                              "headers": init.headers,
                              "body": body,
                              "method": init.method
                          }
                      }
                  });


              }
              send();
              setTimeout(() => {
                  if (!this._data_proxy_response[id]) {
                      send();
                  }
              }, 10000)
              setTimeout(() => {
                  if (!this._data_proxy_response[id]) {
                      send();
                  }
              }, 20000)
          }

      } else {
          id = window.CryptoJS.MD5(JSON.stringify({
              type: "pulg_proxy_request",
              proxy_response_website_url: window.location.origin,
              http: {
                  url: url,
                  option: {
                      "headers": init.headers,
                      "body": body,
                      "method": init.method
                  }
              }
          })).toString().toLowerCase()
          if (!this._data_proxy_request[id]) {
              this._data_proxy_request[id] = true;
              const send = () => {
                  this.postMessage({
                      id: id,
                      type: "pulg_proxy_request",
                      proxy_response_website_url: window.location.origin,
                      http: {
                          url: url,
                          option: {
                              "headers": init.headers,
                              "body": body,
                              "method": init.method
                          }
                      }
                  });
              }
              send();
              setTimeout(() => {
                  if (!this._data_proxy_response[id]) {
                      send();
                  }
              }, 20000)
          }

      }
      return new Promise((r, j) => {
          const getData = () => {
              setTimeout(() => {
                  if (this._data_proxy_response[id]) {

                      r(this._data_proxy_response[id].clone())
                  } else {
                      if (bool) getData()
                  }
              }, 33)
          }
          getData()

          setTimeout(() => {
              bool = false;
              r(new Response(""))
              j(new Response(""))
              this._data_proxy_request[id] = undefined;
          }, 40000)

      })
  }

  async readStreamToString(stream) {
      const reader = stream.getReader();
      let result = [];
      while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result.push(Array.from(value));
      }
      return result;
  }

  getHtml = async (url,
  ) => {
      let id = ''
      let bool = true;
      id = window.CryptoJS.MD5(JSON.stringify({
          type: "website_proxy_request_html",
          proxy_request_website_url: url,
          proxy_response_website_url: window.location.origin
      })).toString().toLowerCase()
      if (!this._data_proxy_request[id]) {
          this._data_proxy_request[id] = true;

          this.postMessage({
              id: id,
              type: "website_proxy_request_html",
              proxy_request_website_url: url,
              proxy_response_website_url: window.location.origin
          });
      }


      return new Promise((r, j) => {
          const getData = () => {
              setTimeout(() => {
                  if (this._data_proxy_response[id]) {
                      r(this._data_proxy_response[id].clone())
                  } else {
                      if (bool) getData()
                  }
              }, 33)
          }
          getData()
          setTimeout(() => {
              bool = false;
              r(new Response(""))
              j(new Response(""))
          }, 30000)
      })
  }

  execute_eval = async (url, javascript) => {
      const id = window.CryptoJS.MD5(JSON.stringify({
          type: "website_request_execute_eval",
          proxy_request_website_url: url,
          proxy_response_website_url: window.location.origin
      })).toString().toLowerCase()

      this.postMessage({
          id: id,
          type: "website_request_execute_script",
          proxy_request_website_url: url,
          proxy_response_website_url: window.location.origin,
          javascript: javascript
      });
      let bool = true;
      return new Promise((r, j) => {
          const getData = () => {
              setTimeout(() => {
                  if (this._data_proxy_response[id]) {
                      r(this._data_proxy_response[id])
                  } else {
                      if (bool) getData()
                  }
              }, 33)
          }
          getData()

          setTimeout(() => {
              bool = false;
              r(new Response(""))
              j(new Response(""))
          }, 40000)

      })
  }


}

if(false) new MessageFetchService()

