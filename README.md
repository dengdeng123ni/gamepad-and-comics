    getCacheImage= async (src) => {
      const cache = await caches.open('image');
      const res = await cache.match(src);
      return res
    }
    onFetch(event) {
      const req = event.request;
      if(req.url.split("/")[3]=="image"){
        event.respondWith(this.getCacheImage(req.url))
        return;
      }
<!-- gamepadandcomics -->
ng deploy --base-href=/gamepad-and-comics/
