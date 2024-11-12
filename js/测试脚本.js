await (async function () {
  let nodes=document.querySelectorAll(".ptt a");
  let arr=nodes[nodes.length-2].href.split("/?p=");
  let length=parseInt(arr[1])
  let data=[];
  data.push(arr[0])
  for (let index = 0; index < length; index++) {
     data.push(`${arr[0]}/?p=${index+1}`)
  }
  return data
})()
