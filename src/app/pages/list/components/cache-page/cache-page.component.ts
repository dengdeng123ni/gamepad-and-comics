import { Component } from '@angular/core';

@Component({
  selector: 'app-cache-page',
  templateUrl: './cache-page.component.html',
  styleUrl: './cache-page.component.scss'
})
export class CachePageComponent {
  constructor() {
    navigator.storage.estimate().then(estimate => {
      console.log(estimate);

      console.log(`Quota: ${estimate.quota}`);


      console.log(`Usage: ${this.formatSizeUnits(estimate.usage)}`);

      console.log((estimate.usage / 1024 / 1024).toFixed(2));

      // console.log(`Usage details: `, estimate.usageDetails);


    });
  }
  formatSizeUnits(bytes) {
    if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1) { bytes = bytes + " bytes"; }
    else if (bytes == 1) { bytes = bytes + " byte"; }
    else { bytes = "0 bytes"; }
    return bytes;
  }
}
