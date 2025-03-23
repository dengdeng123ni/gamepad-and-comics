import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }

  async close() {
    await fetch("/api/win/game/close")
  }

  async openDevTools() {
    await fetch("/api/win/game/openDevTools")
  }

  async openMainMenu() {
    await fetch("/api/win/game/openMainMenu")
  }
}