await (async function () {
  const meta = document.createElement('meta');
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "img-src 'none'";
  document.head.appendChild(meta);
  const length=document.querySelectorAll("#page-select option").length
  let arr = [];
  const sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  for (let index = 0; index < length; index++) {
    arr.push(document.querySelector("#app img").src)
    document.querySelector("#app > nav > div > button:nth-child(5)").click();
    await sleep(10)
  }
  return arr
})()
