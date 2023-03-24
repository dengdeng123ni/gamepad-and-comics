import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppWorkerService {

  constructor() {
  }

  init(id,images){
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage({id,images});

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
