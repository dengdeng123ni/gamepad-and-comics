import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }



  async openDevTools() {
    await window.fetch("/api/win/game/openDevTools")
  }

  async openMainMenu() {
    await window.fetch("/api/win/game/openMainMenu")
  }

  async getLoadFiles(){
    try {
      const res=  await window.fetch("/api/win/game/getLoadFiles")
      return res.json();
    } catch (error) {
       return []
    }
  }
}