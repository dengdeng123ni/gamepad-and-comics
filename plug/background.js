
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
    } else if (request.type == "website_proxy_response") {
      request.type = "proxy_response";
      sendMessageToTargetContentScript(request, request.proxy_response_website_url)
    } else if (request.type == "pulg_proxy_request") {
      if (request.http.option.body) request.http.option.body = await stringToReadStream(request.http.option.body);
      const rsponse = await fetch(request.http.url, request.http.option)
      const data = await readStreamToString(rsponse.body)
      let headers = [];
      rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
      const res = { id: request.id, proxy_response_website_url: request.proxy_response_website_url, type: "website_proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } }
      res.type = "proxy_response";
      sendMessageToTargetContentScript(res, res.proxy_response_website_url)
    } else if (request.type == "page_load_complete") {
      const index = data.findIndex(x => x.tab.pendingUrl == request.url)
      if (index > -1) {
        const obj = data[index];
        setTimeout(() => {
          if (obj.data && obj.data.type && "website_proxy_response_html" == obj.data.type) chrome.tabs.remove(obj.tab.id)
        }, 5000)
        chrome.tabs.sendMessage(obj.tab.id, obj.data);
        data = [];
      }
    }
  }
);
const gamepad_and_comics_url = "http://localhost:3202/"
chrome.commands.onCommand.addListener((command) => {
  const utf8_to_b64 = (str) => {
    return btoa(encodeURIComponent(str));
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url2 = tabs[0].url;
    const url = `${gamepad_and_comics_url}/specify_link/${utf8_to_b64(tabs[0].url)}`
    chrome.tabs.query({}, function (tabs) {
      const index = tabs.findIndex(x => x.title == "GamepadAndComicsV2")
      if (index > -1) {
        chrome.tabs.sendMessage(tabs[index].id, {
          type: "specify_link",
          data: {
            url: url2
          }
        });
      } else {
        chrome.tabs.create({
          active: true,
          url: url
        })
      }
    })

  });
});


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
        data.push({ tab: tab, data: message })
      })
    }else{
      for (let index = 0; index < list.length; index++) {
        chrome.tabs.sendMessage(list[index].id, message);
      }
    }
  });
}
let is=false;
 function  sendMessageToTargetHtml(message, url) {
  if(is){
    setTimeout(()=>{
      chrome.tabs.query({}, function (tabs) {
        const list = tabs.filter(x => x.url== url);
        if (list.length == 0) {
          chrome.tabs.create({
            active: false,
            url: url
          }, (tab) => {
            data.push({ tab: tab, data: message })

          })
        }else{
          for (let index = 0; index < list.length; index++) {
            chrome.tabs.sendMessage(list[index].id, message);
          }
        }
      });
    },1000)
  }else{
    is=true;
    chrome.tabs.query({}, function (tabs) {
      const list = tabs.filter(x => x.url== url);
      if (list.length == 0) {
        chrome.tabs.create({
          active: false,
          url: url
        }, (tab) => {
          data.push({ tab: tab, data: message })

        })
      }else{
        for (let index = 0; index < list.length; index++) {
          chrome.tabs.sendMessage(list[index].id, message);
        }
      }
    });

  }

}


sleep = (duration) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}



chrome.omnibox.onInputStarted.addListener(() => {
  console.log("[" + new Date() + "] omnibox event: onInputStarted");
});

// 当用户的输入改变之后
// text 用户的当前输入
// suggest 调用suggest为用户提供搜索建议
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log("[" + new Date() + "] omnibox event: onInputChanged, user input: " + text);
  // 为用户提供一些搜索建议
  suggest([{
          "content": text + " foo",
          "description": "是否要查看“" + text + " foo” 有关的内容？"
          }, {
              "content": text + " bar",
              "description":"是否要查看“" + text + " bar” 有关的内容？"
          }
          ]);
});

// 按下回车时事件，表示向插件提交了一个搜索
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  console.log("[" + new Date() + "] omnibox event: onInputEntered, user input: " + text + ", disposition: " + disposition);
});

// 取消输入时触发的事件，注意使用上下方向键在搜索建议列表中搜搜也会触发此事件
chrome.omnibox.onInputCancelled.addListener(() => {
  console.log("[" + new Date() + "] omnibox event: onInputCancelled");
});

// 当删除了搜索建议时触发的
chrome.omnibox.onDeleteSuggestion.addListener(text => {
  console.log("[" + new Date() + "] omnibox event: onDeleteSuggestion, text: " + text);
});

// 设置默认的搜索建议，会显示在搜索建议列表的第一行位置，content省略使用用户当前输入的text作为content
chrome.omnibox.setDefaultSuggestion({
          "description": "啥也不干，就是随便试试...."
          })
