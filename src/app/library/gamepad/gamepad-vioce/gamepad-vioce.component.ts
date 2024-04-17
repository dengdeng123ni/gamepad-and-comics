import { Component } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { GamepadVoiceService } from '../gamepad-voice.service';
declare const webkitSpeechRecognition: any;
// declare const speechRecognition: any;
@Component({
  selector: 'app-gamepad-vioce',
  templateUrl: './gamepad-vioce.component.html',
  styleUrls: ['./gamepad-vioce.component.scss']
})
export class GamepadVioceComponent {

  _opened=false;
  text = "";
  recognition$ = new Subject();
  speechRecognition = new webkitSpeechRecognition();


  constructor(public gamepadvioce:GamepadVoiceService) {

    // 配置设置以使每次识别都返回连续结果
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = window.navigator.language || 'en-US';
    // 配置应返回临时结果的设置
    this.speechRecognition.interimResults = true;
    this.speechRecognition.start();
    // 正确识别单词或短语时的事件处理程序1
    this.speechRecognition.onresult = (event) => {

      this.recognition$.next(event)
    };
    this.speechRecognition.onend = (event) => {
      this.speechRecognition.start();
    };
    this.recognition$.subscribe((x: any) => {
      this.text = x.results[x.results.length - 1][0].transcript;
    })
    this.recognition$.pipe(debounceTime(50)).subscribe(x => {
      console.log(this.text);

      this.gamepadvioce.init(this.text)
      setTimeout(() => {
        this.text = "";
      }, 300)
    })

  }
  ngOnDestroy() {
    this.speechRecognition.onend = (event) => {}
    this.speechRecognition.stop();
    this.recognition$.unsubscribe();
  }
}
