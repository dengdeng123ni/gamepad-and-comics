// ==UserScript==
// @name         New Userscript
// @namespace    http://localhost:4200/
// @version      2024-11-04
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        GM_getTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest

// ==/UserScript==

(function () {
  'use strict';

  console.log("加载手柄与插件脚本成功");
  async function readStreamToString(stream) {
    const reader = stream.getReader();
    let result = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result.push(Array.from(value));
    }
    return result;
  }

  async function stringToReadStream(string) {
    const readableStream = new ReadableStream({
      start(controller) {
        for (const data of string) {
          controller.enqueue(Uint8Array.from(data));
        }
        controller.close();
      },
    });
    const response = new Response(readableStream)
    const json = await response.json();
    return JSON.stringify(json);
  }

  function gmFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || 'GET',
        url: url,
        headers: options.headers || {},
        data: options.body || null,
        responseType: 'arraybuffer',
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);

            resolve({
              ok: true,
              status: response.status,
              statusText: response.statusText,
              json: () => Promise.resolve(JSON.parse(response.responseText)), // 处理 JSON 响应
              text: () => Promise.resolve(response.responseText) // 处理文本响应
            });
          } else {
            reject(new Error(`HTTP error! Status: ${response.status}`));
          }
        },
        onerror: function (error) {
          reject(new Error(`Request failed: ${error}`));
        }
      });
    });
  }

  function get() {
    setTimeout(() => {
      const arr = GM_getValue('website_proxy_request');
      if (arr) {

        const arr2 = JSON.parse(arr);
        for (let index = 0; index < arr2.length; index++) {
          const x = arr2[index];
          const obj = JSON.parse(GM_getValue(x))
          cccc(obj)
        }
      }

      if (window.document.title != "手柄与漫画") get();
    }, 500)
  }
  let _datac = {

  }
  let _datac2 = {

  }
  async function cccc(obj) {
    if (_datac[obj.id]) return
    else {
      _datac[obj.id] = obj;
      if (obj.http.option.body) obj.http.option.body = await stringToReadStream(obj.http.option.body);
      const rsponse = await fetch(obj.http.url, obj.http.option)
      const data = await readStreamToString(rsponse.body)
      let headers = [];
      rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
      let res = { id: obj.id, proxy_response_website_url: obj.proxy_response_website_url, type: "proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } }

      let arr = GM_getValue('website_proxy_response');
      if (arr) {
        arr = JSON.parse(arr)
        arr.push(obj.id)
        GM_setValue('website_proxy_response', JSON.stringify(arr));
      } else {
        arr = [];
        arr.push(obj.id)
        GM_setValue('website_proxy_response', JSON.stringify(arr));
      }
      GM_setValue(`${obj.id}_`, JSON.stringify(res));
    }
  }

  async function bbbb(obj) {
    if (_datac2[obj.id]) return
    else {
      _datac2[obj.id] = true;


      window.postMessage(obj)

      _datac2[obj.id]=null;

    }
  }


  function get2() {
    setTimeout(() => {
      const arr = GM_getValue('website_proxy_response');
      if (arr) {

        const arr2 = JSON.parse(arr);
        for (let index = 0; index < arr2.length; index++) {
          const x = arr2[index];
          const obj = JSON.parse(GM_getValue(`${x}_`))
          GM_deleteValue(`${x}_`)
          bbbb(obj)
          const bcc=arr2.filter(c=>c!=x)
          GM_getValue('website_proxy_request',JSON.stringify(bcc));
        }
      }

      if (window.document.title != "手柄与漫画") get();
    }, 500)
  }
  if (window.document.title != "手柄与漫画") get();
  else get2()

  window.addEventListener("message", async function (e) {
    // 查找是否存在目标标签页
    if (e.data) {
      if (window.document.title == "手柄与漫画" && window.location.origin == e.data.proxy_response_website_url) {
        if (e.data.type == "pulg_proxy_request") {
          if (e.data.http.option.body) e.data.http.option.body = await stringToReadStream(e.data.http.option.body);
          const rsponse = await gmFetch(e.data.http.url, e.data.http.option)
          console.log(rsponse);

          const data = await readStreamToString(rsponse.body)
          let headers = [];
          rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
          await window.postMessage({ id: e.data.id, proxy_response_website_url: e.data.proxy_response_website_url, type: "proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } });
        }

        if (e.data.type == "website_proxy_request") {
          let arr = GM_getValue('website_proxy_request');
          if (arr) {
            arr = JSON.parse(arr)
            arr.push(e.data.id)
            GM_setValue('website_proxy_request', JSON.stringify(arr));
          } else {
            arr = [];
            arr.push(e.data.id)
            GM_setValue('website_proxy_request', JSON.stringify(arr));
          }
          GM_setValue(e.data.id, JSON.stringify(e.data));
        }

      }
    }
    if (e.data.type == "proxy_request") {
    }
    if (e.data.type == "background_proxy_request") {
    }
    if (e.data.type == "website_proxy_request") {
    }
    if (e.data.type == "website_proxy_request_html") {
    }
    if (e.data.type == "website_proxy_response_html") {
    }

    if (e.data.type == "website_proxy_response") {

    }
    if (e.data.type == "proxy_response") {

    }
  }, false);
  // Your code here...
})();
