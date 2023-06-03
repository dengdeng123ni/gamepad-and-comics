import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppWorkerService {

  constructor() {
    // for (let index = 0; index < 1000; index++) {
    //   this.init(123,["http://localhost:7899/image/1685733107854"]);

    // }
  }

  init(id,images){
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      worker.onmessage = async ({ data }) => {
        console.log(data);

        // const cache = await caches.open('image');
        // console.log(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data)));
        // const imageSrc = `123/image/${123}`;
        // const request = new Request(imageSrc);
        // const response = new Response(data);
        // await cache.put(request, response);
        // URL.revokeObjectURL(src)

      };
      worker.postMessage(images);

    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }


  }

  // loadImages(data){
  //   return new Observable(obs=>{
  //     this.init("loadImages",data).subscribe(x=>{
  //       obs.next(x)
  //       obs.complete();
  //     })
  //   })
  // }

  // close(){

  // }
}
