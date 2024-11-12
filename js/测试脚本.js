await (async function () {
  const meta = document.createElement('meta');
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "img-src 'none'";
  document.head.appendChild(meta);
  const length=parseInt(document.querySelector(".tp").textContent)
  const hr=document.querySelector("#fimg").getAttribute("data-src").split("/")
  const type=hr.pop().split(".")[1]
  const c=hr.join("/")+"/"
  let arr = [];
  for (let index = 0; index < length; index++) {
     arr.push(c+(index+1)+"."+type)
  }
  return arr
})()
