/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  if (data.type == "UrlToBolbUrl") {
    const res = await getImage(data.data)
    if (res) {
      const url = URL.createObjectURL(res)
      postMessage({ id: data.id, type: data.type, data: url });
    } else {
      postMessage({ id: data.id, type: "load_image", data: data.data });
    }
  }
  if (data.type == "UrlToBase64Url") {

  }
  if (data.type == "compress_multiple") {
    const arr = data.data;
    if (arr) {
      for (let index = 0; index < arr.length; index++) {
        await compressImage(arr[index], data.width, data.quality)
      }
      postMessage({ type: "destroy" });
    } else {
      postMessage({ type: "destroy" });
    }
  }
});
var cache: Cache;
const init = async () => {
  cache = await caches.open('image');
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


async function compressImage(imageSrc: string, width: number, quality: number) {
  const bool = await caches.match(`${imageSrc}?width=${width}&quality=${quality}`);
  if (bool) {
    return
  }
  const res = await caches.match(imageSrc);
  const blob = await res.blob()
  const image1 = await createImageBitmap(blob)
  const canvas = new OffscreenCanvas(image1.width, image1.height);
  canvas.width = image1.width;
  canvas.height = image1.height;
  if (canvas.width > canvas.height) {
    canvas.width = width * 2;
    canvas.height = width * 2 * (image1.height / image1.width);
  } else {
    canvas.width = width;
    canvas.height = width * (image1.height / image1.width);
  }
  let context = canvas.getContext('2d');
  context.rect(0, 0, canvas.width, canvas.height);
  context.drawImage(image1, 0, 0, canvas.width, canvas.height);
  const blob1 = await canvas.convertToBlob({ type: "image/webp", quality })
  await cache.put(`${imageSrc}?width=${width}&quality=${quality}`, new Response(blob1))

}
