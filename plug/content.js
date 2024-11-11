
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    window.postMessage(request, '*');



  }
);

window.addEventListener("message", async function (e) {
  if (e.data && e.data.type == "proxy_request") {
    await chrome.runtime.sendMessage(e.data);
  }
  if (e.data && e.data.type == "background_proxy_request") {
    await chrome.runtime.sendMessage(e.data);
  }
  if (e.data && e.data.type == "website_proxy_request") {
    await chrome.runtime.sendMessage(e.data);
  }
  if (e.data && e.data.type == "website_proxy_request_html") {
    await chrome.runtime.sendMessage(e.data);
  }

  if (e.data && e.data.type == "website_proxy_response_html") {
    const src = document.body.innerHTML;
    var myBlob = new Blob([src], {
      type: "application/text"
    });
    var init = { status: 200, statusText: "OK" };
    var rsponse = new Response(myBlob, init);
    const data = await readStreamToString(rsponse.body)
    let headers = [];
    rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
    await chrome.runtime.sendMessage({ id: e.data.id, proxy_response_website_url: e.data.proxy_response_website_url, type: "website_proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } });
    await chrome.runtime.sendMessage({ type: "tab_close", tab_id: e.data.tab.id })

  }


  if (e.data && e.data.type == "pulg_proxy_request") {
    await chrome.runtime.sendMessage(e.data);
  }

  if (e.data && e.data.type == "website_proxy_response") {
    if (e.data.http.option.body) e.data.http.option.body = await stringToReadStream(e.data.http.option.body);
    const rsponse = await fetch(e.data.http.url, e.data.http.option)
    const data = await readStreamToString(rsponse.body)
    let headers = [];
    rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
    await chrome.runtime.sendMessage({ id: e.data.id, proxy_response_website_url: e.data.proxy_response_website_url, type: "website_proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } });

  }

  if (e.data && e.data.type == "proxy_response") {

  }

  if (e.data && e.data.type == "website_request_execute_script") {
    await chrome.runtime.sendMessage(e.data);
  }

  if (e.data && e.data.type == "website_response_execute_script") {
    const data = await executeEval(e.data.javascript);
    await chrome.runtime.sendMessage({ id: e.data.id, proxy_response_website_url: e.data.proxy_response_website_url, type: "website_response_execute_script", data: data });
  }

  if (e.data && e.data.type == "current_tab_close") {
    await chrome.runtime.sendMessage({ type: "current_tab_close" });
  }

  if (e.data && e.data.type == "new_page") {
    console.log({ type: "new_page",url:e.data.url });

    await chrome.runtime.sendMessage({ type: "new_page",url:e.data.url });
  }

}, false);


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

async function init() {
  chrome.runtime.sendMessage({
    'type': 'page_load_complete',
    'url': window.location.href
  });
}

function executeScript(code) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const messageName = "error_" + Math.floor(Math.random() * 100000);
    const handler = (e) => reject((e).detail);
    window.addEventListener(messageName, handler);
    script.textContent = `(function(){
        try {
          ${code}
        } catch(e) {
          window.dispatchEvent(new CustomEvent('${messageName}', { detail: e }));
        }
    })()`;
    document.body.appendChild(script);
    document.body.removeChild(script);

    window.removeEventListener(messageName, handler);
    resolve(true);
  });

}

async function executeEval(code) {
  return eval(code)
}



const sleep = (duration) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}


init();


