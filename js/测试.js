await (async function () {
  const nodes=document.querySelectorAll(".gltc tr");
  let list=[];
  for (let index = 1; index < nodes.length; index++) {
    const x = nodes[index];
    let obj={}

    const src=x.querySelector(".glthumb img").getAttribute("data-src");
    obj["cover"]=src;
    const title=x.querySelector(".glname").textContent.trim();
    obj["title"]=title;
    const id=x.querySelector(".glname a").href
    obj["id"]=window.btoa(encodeURIComponent(id));
    const subTitle=x.querySelector(".gl1c").textContent
    obj["subTitle"]=subTitle;
    list.push(obj)
  }
  return list
})()
// title
