import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GamepadSoundService {
  async loadSound(url) {
    if (!this.opened) return
    var audio = new Audio();
    fetch(url);
    audio.src = url;
    audio.load();
    audio.play();
  }
  audio = null;
  async loadSoundContinuous(url) {
    if (!this.opened) return
    if (this.audio&&!this.audio.paused) return
    this.audio = new Audio();
    fetch(url);
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }
  opened = true;
  constructor() {
    window.addEventListener('click', e => {
      // var sound = this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/tick.wav");
    })
    window.addEventListener('contextmenu', e => {
      // var sound = this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/select.wav");
    })
    if (localStorage.getItem('sound') == "close") this.opened = false;
  }
  obj = {
    UP: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/klick.wav"),
    RIGHT: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/klick.wav"),
    DOWN: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/klick.wav"),
    LEFT: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/klick.wav"),
    LEFT_ANALOG_PRESS: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/popup+runtitle.wav"),
    RIGHT_ANALOG_PRESS: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/popup+runtitle.wav"),
    A: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/tick.wav"),
    B: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/enter & back.wav"),
    X: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/select.wav"),
    Y: () => {},
    LEFT_TRIGGER: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/border.wav"),
    LEFT_BUMPER: () => this.loadSoundContinuous("assets/sound/nintendo_switch/turnoff.wav"),
    RIGHT_TRIGGER: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/border.wav"),
    RIGHT_BUMPER: () => this.loadSoundContinuous("assets/sound/nintendo_switch/turnon.wav"),
    SELECT: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/klick.wav"),
    START: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/bing.wav"),
    SPECIAL: () => this.loadSound(document.querySelector("base").href+"assets/sound/nintendo_switch/klick.wav"),
  }
  index = -1;
  input = "";
  device(input: string, node: HTMLElement, region: string, index: number) {
     try {
      if (index == this.index && (input == "UP" || input == "RIGHT" || input == "DOWN" || input == "LEFT")) {
        this.obj[input]();
      } else {
        if ((input == "RIGHT_BUMPER" || input == "LEFT_BUMPER")) {
          this.obj[input]();
        } else {
          this.obj[input]();
        }
        this.input = input;
        this.index = index;
      }
     } catch (error) {

     }
  }


}
