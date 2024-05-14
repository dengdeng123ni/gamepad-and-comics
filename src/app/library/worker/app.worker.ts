/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  if (data.type == "UrlToBolbUrl") {
    const res = await getImage(data.data)
    if(res){
      const url = URL.createObjectURL(res)
      postMessage({ id: data.id, type: data.type, data: url });
    }else{
      postMessage({ id: data.id, type: "load_image", data: data.data });
    }
  }
});
var cache: CacheStorage;
const init = async () => {
  cache = await caches.open('image') as any;
  postMessage({ type: "init" });
}
init();
const getImage = async (url) => {
  const res = await cache.match(url);
  if (res) {
    const blob = await res.blob()
    if (blob.size < 1000) {
      return null
    }
    return blob
  } else {
    return null
  }
}
