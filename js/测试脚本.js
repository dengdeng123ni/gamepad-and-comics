await (async function () {
  const meta = document.createElement('meta');
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "img-src 'none'";
  document.head.appendChild(meta);
  const length=parseInt(document.querySelector(".current-page-number").parentNode.textContent.split("/").at(-1))
  let arr = [];
  for (let index = 0; index < length; index++) {
    arr.push(document.querySelector("#current-page-image").src)
    document.querySelector(".arrow-right").click();
  }
  return arr
})()
