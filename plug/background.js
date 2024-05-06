
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
      const index = data.filter(x=>x.tab).findIndex(x => x.tab.pendingUrl == request.url)
      if (index > -1) {
        const obj = data[index];
        setTimeout(() => {
          if (obj.data && obj.data.type && "website_proxy_response_html" == obj.data.type) chrome.tabs.remove(obj.tab.id)
        }, 3000)
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
