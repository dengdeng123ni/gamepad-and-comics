class MessageFetchService {
  _data_proxy_response = {};
  _data_proxy_request = {};
  constructor() {
      if(window.electron){
        window.electron.receiveMessage('message-from-main', async (event, message) => {
            if (message.type == "proxy_response") {
                let rsponse = message.data;
                const blob = new Blob([rsponse.body]);
                delete rsponse.body;
                const headers = new Headers();
                rsponse.headers.forEach((x) => {
                    headers.append(x.name, x.value);
                })
                rsponse.headers = headers;

                this._data_proxy_response[message.id] = new Response(blob, rsponse)

                setTimeout(() => {
                    this._data_proxy_response[message.id] = undefined;
                    this._data_proxy_request[message.id] = undefined;
                }, 40000)
            } else if (message.type == "execute_script_data") {
                this._data_proxy_response[message.id] = message.data;
                setTimeout(() => {
                    this._data_proxy_response[message.id] = undefined;
                }, 40000)
            } else if (message.type == "proxy_data") {
                this._data_proxy_response[message.id] = message.data;
                setTimeout(() => {
                    this._data_proxy_response[message.id] = undefined;
                }, 40000)
            } else if (message.type == "electron_send_local") {
                const res = await window._gh_receive_message(message.data)
                this.postMessage({
                    send_client_id: message.send_client_id,
                    receiver_client_id: message.receiver_client_id,
                    type: "electron_receive_local",
                    data: res,
                    id:message.id
                })
            }

        });

        window._gh_fetch = this.fetch;
        window._gh_get_html = this.getHtml;
        window._gh_execute_eval = this.execute_eval;
      }
  }

  postMessage = (data) => {
      window.electron.sendMessage('message-from-renderer', data);
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

new MessageFetchService()

