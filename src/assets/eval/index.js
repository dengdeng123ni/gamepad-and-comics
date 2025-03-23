

class MessageFetchService {
  _data_proxy_response = {};
  _data_proxy_request = {};
  constructor() {
    const isNode = typeof global !== 'undefined' && global.process && global.process.versions && global.process.versions.node;
    if (isNode) {

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

      const puppeteer = require('puppeteer');
      let browser = null;
      async function getBrowser() {
        browser = await puppeteer.launch({
          // headless: false,
          defaultViewport: null, // 设置为 null 窗口会最大化
          args: ['--start-maximized'], // 启动时最大化窗口
        });

      }


      async function executeEval(url, js) {
        if (!browser) {
          await getBrowser();
        }
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const res = await page.evaluate(async (js) => {
          const data = await eval(js)

          return data
        }, js);
        await page.close();
        return res
      }
      window._gh_execute_eval = async (url, js) => {
        return await executeEval(url, js)
      };
      window._gh_get_html = async (url) => {
        const src = await window._gh_execute_eval(url, `(async function () {
  return document.documentElement.outerHTML;
  })()`)
        var myBlob = new Blob([src], {
          type: "application/text"
        });
        var init = { status: 200, statusText: "OK" };
        var rsponse = new Response(myBlob, init);
        return rsponse
      };

    }

  }
}


new MessageFetchService()

