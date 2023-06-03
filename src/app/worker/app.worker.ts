/// <reference lib="webworker" />


addEventListener('message', async ({ data }) => {
  const href=data;
  const loadImage = async (imageUrl): Promise<ImageBitmap> =>  await createImageBitmap(await fetch(imageUrl).then((r) => r.blob()))
  const offscreen = new OffscreenCanvas(100, 100);
  const ctx = offscreen.getContext('2d');
  const imgData = await loadImage(href);
  offscreen.width = imgData.width;
  offscreen.height = imgData.height;
  ctx.drawImage(imgData, 0, 0, offscreen.width, offscreen.height);
  const blob = await offscreen.convertToBlob({ type: 'image/jpeg', quality: 0.75 })
  const cache = await caches.open('image');
  const imageSrc = `/image/${123}`;
  const request = new Request(imageSrc);
  const response = new Response(blob);
  await cache.put(request, response);
  postMessage(imageSrc);
});



