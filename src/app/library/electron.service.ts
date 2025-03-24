import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }

  async close() {
    await fetch("http://localhost:7701/api/win/game/close")
  }

  async openDevTools() {
    await fetch("http://localhost:7701/api/win/game/openDevTools")
  }

  async openMainMenu() {
    await fetch("http://localhost:7701/api/win/game/openMainMenu")
  }

  async getLoadFiles(){
     const res=  await fetch("http://localhost:7701/api/win/game/getLoadFiles")
     return res.json();
  }
}