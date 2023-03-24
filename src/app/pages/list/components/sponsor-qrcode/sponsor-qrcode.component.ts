import { Component } from '@angular/core';
import QRCode from 'qrcode'
import { SponsorQrcodeService } from './sponsor-qrcode.service';
@Component({
  selector: 'app-sponsor-qrcode',
  templateUrl: './sponsor-qrcode.component.html',
  styleUrls: ['./sponsor-qrcode.component.scss']
})
export class SponsorQrcodeComponent {
  constructor(public SponsorQrcode:SponsorQrcodeService,){}

  ngAfterViewInit() {
    var canvas = document.getElementById('canvas')
    QRCode.toCanvas(canvas, this.SponsorQrcode.data, function (error) {
      if (error) console.error(error)
    })
  }


}
