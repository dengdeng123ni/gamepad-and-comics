
chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    // pulg_proxy_request 插件发起请求
    if (request.type == "pulg_proxy_request") {
      if (request.http.option.body) request.http.option.body = await stringToReadStream(request.http.option.body);
      const rsponse = await fetchWithTimeoutAndRace(request.http.url, request.http.option)
      const data = await readStreamToString(rsponse.body)
      let headers = [];
      rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
      let res = {
        id: request.id,
        target: "page",
        type: "proxy_response",
        data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url }
      }
      chrome.tabs.sendMessage(sender.tab.id, res)
      return
    }

    // website_proxy_request 代理网址发起请求,打开或找到对应网址,有内容页面发起请求,数据回传给后台,由后台返回对应请求
    if (request.type == "website_proxy_request") {
      request.target = "content"
      request.send_tab_id = sender.tab.id;
      const receiver_id = await getTabId(request.target_website);
      chrome.tabs.sendMessage(receiver_id, request)
      return
    } else if (request.type == "website_proxy_response") {
      chrome.tabs.sendMessage(request.send_tab_id, {
        id: request.id,
        target: "page",
        type: "proxy_response",
        data: request.data
      })
      return
    }
    //get_website_request_html 获取目标网站的dom
    if (request.type == "get_website_request_html") {
      request.target = "content"
      request.send_tab_id = sender.tab.id;
      const windowId = await getOnFocusedWindowId()
      const receiver_id = await newTab(request.target_website, windowId)
      chrome.tabs.sendMessage(receiver_id, request)
      return
    } else if (request.type == "get_website_response_html") {
      request.type = "proxy_response";
      chrome.tabs.sendMessage(request.send_tab_id, {
        id: request.id,
        target: "page",
        type: "proxy_response",
        data: request.data
      })
      chrome.tabs.remove(sender.tab.id);
      return
    }
    //website_response_execute_script 执行代码
    if (request.type == "website_request_execute_script") {
      request.target = "content"
      request.send_tab_id = sender.tab.id;
      const windowId = await getOnFocusedWindowId()
      const receiver_id = await newTab(request.target_website, windowId)
      chrome.tabs.sendMessage(receiver_id, request)
      return
    } else if (request.type == "website_response_execute_script") {
      chrome.tabs.sendMessage(request.send_tab_id, {
        id: request.id,
        target: "page",
        type: "proxy_data",
        data: request.data
      })
      chrome.tabs.remove(sender.tab.id);
      return
    }

    if (request.type == "get_all_browser_client") {
      chrome.tabs.query({}, function (tabs) {
        _client_data= _client_data.filter(
          (item, index, self) => index === self.findIndex((t) => t.client.id === item.client.id)
        );
        _client_data = _client_data.filter(x => tabs.find(c => c.id == x.tabId))


        chrome.tabs.sendMessage(sender.tab.id, {
          id: request.id,
          target: "page",
          type: "proxy_data",
          data: _client_data.map(x => x.client)
        })
      })
      return
    } else if (request.type == "add_browser_client") {
      _client_data.push({
        tabId: sender.tab.id,
        client: request.client
      })
      chrome.tabs.sendMessage(sender.tab.id, {
        target: "page",
        type: "proxy_data"
      })
      return
    }
    // 通道信息
    if (request.type == "proxy_request_local") {
      request.target = "page"
      const obj = _client_data.find(x => x.client.id == request.receiver_client_id)
      chrome.tabs.sendMessage(obj.tabId, request)
      return
    } else if (request.type == "proxy_response_local") {
      const obj = _client_data.find(x => x.client.id == request.send_client_id)
      chrome.tabs.sendMessage(obj.tabId, {
        id: request.id,
        target: "page",
        send_client_id: request.send_client_id,
        receiver_client_id: request.receiver_client_id,
        type: "proxy_data",
        data: request.data
      })
      return
    }
    // -----------------------------------------
    // if (request.type == "proxy_request_local") {

    //   return
    // } else if (request.type == "proxy_response_local") {
    //   return
    // }




    if (request.type == "page_load_complete") {
      _tabIds[sender.tab.id] = sender.tab.id;
      setTimeout(() => {
        _tabIds[sender.tab.id] = undefined;
      }, 3000)
    }

  }
);

_client_data = [];

_tabIds = {};

function getTabId(url) {
  return new Promise((resolve, reject) => {
    // 查询所有标签页
    chrome.tabs.query({}, function (tabs) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      // 查找匹配的标签页
      const matchingTab = tabs.find(tab => tab.url && tab.url.startsWith(url));

      if (matchingTab) {
        // 如果找到，直接返回标签页 ID
        return resolve(matchingTab.id);
      }

      // 未找到匹配的标签页，创建一个新的标签页
      chrome.tabs.create({ active: false, url: url }, (tab) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        // 监听新标签页的加载状态
        const listener = function (tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve(tabId); // 返回新标签页 ID
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });
    });
  });
}

function getOnFocusedWindowId() {
  return new Promise((resolve, reject) => {
    chrome.windows.getAll({ populate: false }, (windows) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError); // 处理 API 调用错误
      }

      // 查找第一个未聚焦的窗口
      const unfocusedWindow = windows.find(window => !window.focused);

      if (unfocusedWindow) {
        // 如果找到未聚焦窗口，返回其 ID
        return resolve(unfocusedWindow.id);
      }

      // 如果没有未聚焦窗口，创建新的窗口
      chrome.windows.create(
        { type: 'normal', focused: false },
        (newWindow) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError); // 处理创建窗口时的错误
          }
          resolve(newWindow.id);
        }
      );
    });
  });
}

function newTab(url, windowId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ active: true, windowId, url }, (tab) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError); // 处理创建失败的情况
      }
      const get = () => {
        setTimeout(() => {
          if (_tabIds[tab.id]) resolve(tab.id)
          else get()
        }, 33)
      }
      get()
    });
  });
}

async function fetchWithTimeoutAndRace(url, options = {}) {
  try {
    try {
      const requestPromise = await fetch(url, options);
      return requestPromise;
    } catch (error) {
      const requestPromise = await fetch(url, options);
      return requestPromise
    }
  } catch (error) {
    return null
  }
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

sleep = (duration) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}


init = async (url) => {
  let _data = {};
  let socket = new WebSocket(url);

  // 监听连接打开事件
  socket.addEventListener('open', async () => {
    const jsonData = { type: "init", name: navigator.userAgent, id: this.send_client_id };
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: "application/json" });
    socket.send(blob);
  });
  // 监听消息事件
  socket.addEventListener('message', async (event) => {
    const text = await new Blob([event.data]).text();
    const c = JSON.parse(text);
    if (c.type == "send") {
      const res = await window._gh_receive_message(c.data)
      let obj = {
        id: c.id,
        receiver_client_id: c.send_client_id,
        send_client_id: c.receiver_client_id,
        type: "receive",
        data: res
      }
      const jsonString = JSON.stringify(obj);
      const blob = new Blob([jsonString], { type: "application/json" });
      socket.send(blob);
    } else if (c.type == "receive") {
      _data[c.id] = c.data;
    } else if (c.type == "get_all_client") {
      _data[c.id] = c.data.filter((item, index, self) =>
        index === self.findIndex((t) => (t.id === item.id))
      );
    }
  });

  // 监听错误事件
  socket.addEventListener('error', (error) => {
    console.error('客户端错误', error);
  });

  // 监听连接关闭事件
  socket.addEventListener('close', () => {
    console.log('关闭客户端链接');
  });
}
