
class MessageFetchService {
  _data_proxy_response = {};
  _data_proxy_request = {};
  constructor() {
      window._gh_fetch = async (url, init) => {
          async function capacitorFetch(url, options) {
              return await fetch(url, options)
          }

          let id = CryptoJS.MD5(JSON.stringify({
              url: url,
              init: init
          })).toString().toLowerCase()
          if (!this._data_proxy_request[id]) {
              this._data_proxy_request[id] = true;
              const send = async () => {
                  this._data_proxy_response[id] = await capacitorFetch(url, init);
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
          let bool = true;
          return new Promise((r, j) => {
              const getData = () => {
                  setTimeout(() => {
                      if (this._data_proxy_response[id]) {
                          bool = false;
                          r(this._data_proxy_response[id].clone())
                      } else {
                          if (bool) getData()
                      }
                  }, 33)
              }
              getData()

              setTimeout(() => {
                  if (bool) {
                      bool = false;
                      r(new Response())
                      j(new Response())
                  }
                  this._data_proxy_request[id] = undefined;
                  this._data_proxy_response[id] = undefined;
              }, 40000)
          })
      };
  }
}

new MessageFetchService()

