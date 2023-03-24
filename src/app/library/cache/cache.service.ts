import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  urls_html = [];
  urls = [];

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      // NavigationEnd,NavigationCancel,NavigationError,RoutesRecognized
      if (event instanceof NavigationStart) {
        this.urls_html.forEach(x => URL.revokeObjectURL(x.changingThisBreaksApplicationSecurity))
        this.urls.forEach(x => URL.revokeObjectURL(x))
      }
    })
  }

  getBlobImageHtml = async (src) => {
    if (typeof (src) != 'string') return src
    const cache = await caches.open('image');
    const res = await cache.match(src)
    const blob = await res.blob()
    const img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this.urls_html.push(img)
    return img
  }
  blobToDataURI(blob) {
    return new Promise((r, j) => {
       var reader = new FileReader();
       reader.onload = function (e) {
         r(e.target.result)
       }
       reader.onerror = function (e) {
         j(e.target.result);
       }

       reader.readAsDataURL(blob);
     })
   }
  getBlobImage = async (src) => {
    if (typeof (src) != 'string') return src
    const cache = await caches.open('image');
    const res = await cache.match(src)
    const blob = await res.blob()
    const img = URL.createObjectURL(blob);
    this.urls.push(img)
    return img
  }

  // delBlobImage=  (src) => {
  //   URL.revokeObjectURL(src);
  // }

}
