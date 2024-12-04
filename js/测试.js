await(async function () {
  const getHtmlUrl = async (url) => {
    const res = await window._gh_fetch(url, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "content-type": "application/json;charset=UTF-8"
      },
      "body": null,
      "method": "GET"
    });
    const text = await res.text();
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/html');
    return doc.querySelector("#img").src
  }
  return await getHtmlUrl('https://e-hentai.org/s/c340a5e56f/3146237-1')
})()
