import { Component } from '@angular/core';
import { ConfigReaderService } from '../../services/config.service';
import { ReaderAutoService } from '../reader-auto/reader-auto.service';
import { ReaderAutoSettingsService } from './reader-auto-settings.service';

@Component({
  selector: 'app-reader-auto-settings',
  templateUrl: './reader-auto-settings.component.html',
  styleUrls: ['./reader-auto-settings.component.scss']
})
export class ReaderAutoSettingsComponent {

 constructor(public config:ConfigReaderService,
  public readerAuto:ReaderAutoService,
  public readerAutoSettings:ReaderAutoSettingsService
  ){

 }
 on(){
  this.readerAuto.open();
  this.readerAutoSettings.close();
 }
 close(){
  this.readerAutoSettings.close();
 }
}
