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

  if (data.type == "compress_multiple2") {
    const arr = data.data;
    if (arr) {
     await MergePictures(arr, data.quality)
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
  if (!res) {
    return
  }
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


async function MergePictures(arr: any, quality: number) {
  const createImage = async (url) => {
    const res = await caches.match(url);
    const blob = await res.blob()
    const image1 = await createImageBitmap(blob)
    return image1
  }
  for (let index = 0; index < arr.length; index++) {
    const x = arr[index];
    const canvas = new OffscreenCanvas(x.page.width, x.page.height);
    canvas.width = x.page.width;
    canvas.height = x.page.height;
    let context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (x.images.length == 1) {
      var img = await createImage(x.images[0].img) as any;
      context.drawImage(img, x.images[0].x, x.images[0].y, x.images[0].width, x.images[0].height);
    } else if (x.images.length == 2) {
      var img = await createImage(x.images[0].img) as any;
      var img1 = await createImage(x.images[1].img) as any;
      context.drawImage(img, x.images[0].x, x.images[0].y, x.images[0].width, x.images[0].height);
      context.drawImage(img1, x.images[1].x, x.images[1].y, x.images[1].width, x.images[1].height);
    }
    const blob1 = await canvas.convertToBlob({ type: "image/webp", quality })

    await cache.put(`http://localhost:7700/download/${x.md5}`, new Response(blob1))

  }

}


