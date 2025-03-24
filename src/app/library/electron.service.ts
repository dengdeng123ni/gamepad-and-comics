import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }

  async close() {
    await window.fetch("http://localhost:7701/api/win/game/close")
  }

  async openDevTools() {
    await window.fetch("http://localhost:7701/api/win/game/openDevTools")
  }

  async openMainMenu() {
    await window.fetch("http://localhost:7701/api/win/game/openMainMenu")
  }

  async getLoadFiles(){
    try {
      const res=  await window.fetch("http://localhost:7701/api/win/game/getLoadFiles")
      return res.json();
    } catch (error) {
       return []
    }
  }
}