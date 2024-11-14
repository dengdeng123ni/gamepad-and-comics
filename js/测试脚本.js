await(async function () {
  const meta = document.createElement('meta');
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "img-src 'none'";
  document.head.appendChild(meta);
  const nodes = document.querySelectorAll(".reply-item")
  let arr = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    let obj = {};

    const name = node.querySelector(".user-name").textContent;
    const message = node.querySelector(".reply-content").textContent;
    const date = node.querySelector(".reply-time").textContent;
    obj["name"] = name;
    obj["message"] = message;
    obj["date"] = date;
    arr.push(obj)
  }
  setTimeout(() => {
    window.close();
  }, 500)
  return arr
})()
