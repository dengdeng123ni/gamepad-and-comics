await(async function () {
  const nodes = document.querySelectorAll("#taglist tr");
  let list = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    const nodes2 = node.querySelectorAll("a");
    const category = node.querySelector(".tc").textContent
    for (let j = 0; j < nodes2.length; j++) {
      const c = nodes2[j];
      list.push({
        category,
        c: c.textContent,
        href: c.href
      })
    }
  }
  return list
})()

// category:"",
// name:"",
// href:"",
// id:""
// title
