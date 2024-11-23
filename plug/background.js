
chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    if (request.type == "proxy_request") {
      const rsponse = await fetch(request.data.url)
      const data = await readStreamToString(rsponse.body)
      let headers = [];
      rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
      sendMessageToContentScript({ id: request.id, type: "proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } })
    } else if (request.type == "website_proxy_request") {
      request.type = "website_proxy_response";
      sendMessageToTargetContentScript(request, request.proxy_request_website_url)
    } else if (request.type == "website_proxy_request_html") {
      request.type = "website_proxy_response_html";
      sendMessageToTargetHtml(request, request.proxy_request_website_url)
    } else if (request.type == "get_all_tabs") {
      request.type = "proxy_data";
      getCurrentTabs(request)
    } else if (request.type == "website_request_execute_script") {
      request.type = "website_response_execute_script";
      sendMessageToTargetHtml(request, request.proxy_request_website_url)
    } else if (request.type == "website_response_execute_script") {
      request.type = "execute_script_data";
      sendMessageToTargetContentScript(request, request.proxy_response_website_url)
    } else if (request.type == "website_proxy_response") {
      request.type = "proxy_response";
      sendMessageToTargetContentScript(request, request.proxy_response_website_url)
    } else if (request.type == "pulg_proxy_request") {
      if (request.http.option.body) request.http.option.body = await stringToReadStream(request.http.option.body);
      const rsponse = await fetch(request.http.url, request.http.option)
      const data = await readStreamToString(rsponse.body)
      let headers = [];
      rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
      let res = { id: request.id, proxy_response_website_url: request.proxy_response_website_url, type: "website_proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } }
      res.type = "proxy_response";
      sendMessageToTargetContentScript(res, res.proxy_response_website_url)
    } else if (request.type == "page_load_complete") {
      const index = data.findIndex(x => x.tab.pendingUrl == request.url)
      if (index > -1) {
        const obj = data[index];
        chrome.tabs.sendMessage(obj.tab.id, obj.data);
        data = [];
      }
    } else if (request.type == "tab_close") {
      chrome.tabs.remove(request.tab_id);
    } else if (request.type == "current_tab_close") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
      });
    } else if (request.type == "new_page") {
      newPage(request)
    }


  }
);

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
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}
let data = [];
function sendMessageToTargetContentScript(message, url) {
  chrome.tabs.query({}, function (tabs) {
    const list = tabs.filter(x => x.url.substring(0, url.length) == url);
    if (list.length == 0) {
      chrome.tabs.create({
        active: false,
        url: url
      }, (tab) => {
        data.push({
          tab: tab, data: {
            tab: tab,
            ...message
          }
        })
      })
    } else {
      for (let index = 0; index < list.length; index++) {
        chrome.tabs.sendMessage(list[index].id, {
          tab: list[index],
          ...message
        });
      }
    }
  });
}
let createdWindowId = 123;
function newPage(request) {
  let url = request.proxy_request_website_url;
  chrome.windows.get(createdWindowId, { populate: true }, function (window) {
    if (window) {
      chrome.tabs.query({}, function (tabs) {
        const list = tabs.filter(x => x.url.substring(0, url.length) == url);
        if (list.length == 0) {
          chrome.tabs.create({
            active: true,
            windowId: createdWindowId,
            url: url
          }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
              if (tabId === tab.id && changeInfo.status === "complete") {
                sendMessageToTargetContentScript({
                  id: request.id,
                  type: "execute_script_data",
                  data: tab
                }, request.proxy_response_website_url)
                chrome.tabs.onUpdated.removeListener(listener);
              }
            });

          })
        } else {
          for (let index = 0; index < list.length; index++) {
            chrome.tabs.remove(list[index].id);
          }
          chrome.tabs.create({
            active: true,
            windowId: createdWindowId,
            url: url
          }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
              if (tabId === tab.id && changeInfo.status === "complete") {
                sendMessageToTargetContentScript({
                  id: request.id,
                  type: "execute_script_data",
                  data: tab
                }, request.proxy_response_website_url)
                chrome.tabs.onUpdated.removeListener(listener);
              }
            });
          })
        }
      });
    } else {
      chrome.windows.create({
        type: 'normal',
        focused: false,
      }, function (newWindow) {
        createdWindowId = newWindow.id;
        chrome.tabs.create({
          active: true,
          windowId: createdWindowId,
          url: url
        }, (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === "complete") {
              sendMessageToTargetContentScript({
                id: request.id,
                type: "execute_script_data",
                data: tab
              }, request.proxy_response_website_url)
              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        })
      });
    }
  });


}
let is = false;
function sendMessageToTargetHtml(message, url) {
  chrome.windows.get(createdWindowId, { populate: true }, function (window) {
    if (window) {
      chrome.tabs.create({
        active: true,
        windowId: createdWindowId,
        url: url
      }, (tab) => {
        data.push({
          tab: tab, data: {
            tab: tab,
            ...message
          }
        })
      })
    } else {
      chrome.windows.create({
        type: 'normal',
        focused: false,
      }, function (newWindow) {
        createdWindowId = newWindow.id;
        chrome.tabs.create({
          active: true,
          windowId: createdWindowId,
          url: url
        }, (tab) => {
          data.push({
            tab: tab, data: {
              tab: tab,
              ...message
            }
          })
        })
      });
    }
  });


}

sleep = (duration) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}

const init = () => {
  clearTabs();
}

const clearTabs = () => {
  setTimeout(() => {
    const INACTIVITY_LIMIT = 5*60*1000
    chrome.windows.getAll({ populate: false }, (windows) => {
      chrome.tabs.query({}, function (tabs) {
        const now = Date.now();
        tabs.forEach(x => {
          const index = windows.findIndex(c => c.id == x.windowId);
          x.window = windows[index];
          if (!x.window.focused) {
            if ((now - x.lastAccessed) < INACTIVITY_LIMIT) {
              chrome.tabs.remove(x.id);
            }
          }
        })
      })
    });
    clearTabs()
  },  5*60*1000)
}

const getCurrentTabs = (request) => {
  chrome.windows.getAll({ populate: false }, (windows) => {

    chrome.tabs.query({}, function (tabs) {
      const now = Date.now();
      let arr=[];
      tabs.forEach(x => {
        const index = windows.findIndex(c => c.id == x.windowId);
        x.window = windows[index];
        if (x.window.focused) {
          arr.push(x)
        }
      })
      sendMessageToTargetContentScript({
        ...request,
        data:arr
      }, request.proxy_response_website_url)
    })


  });
}


init();
