import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AppDataService, IndexdbControllerService, NotifyService, PromptService } from 'src/app/library/public-api';
import { FavoritesPageService } from './favorites-page.service';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss'
})
export class FavoritesPageComponent {
  list=[];

  constructor(
    public AppData:AppDataService,
    public webDb:IndexdbControllerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data,
    public FavoritesPage:FavoritesPageService,
    public Notify:NotifyService,
    public prompt:PromptService
  ){
    console.log(data);

     this.getAll();
  }
  async getAll(){
    this.list = await this.webDb.getAll('favorites_menu')
  }
  async on(index){
    this.data=this.data;
    for (let index = 0; index < this.data.length; index++) {
      const x = this.data[index];
      x.comics_id=x.id;
      x.favorites_id=this.list[index].id;
      x.id=`${x.favorites_id}_${x.comics_id}`
      x.source=this.AppData.source;
      x.add_favorites_date=new Date().getTime()
      await this.webDb.update('favorites_comics', x)
    }
    this.FavoritesPage.close();
    this.Notify.messageBox("已添加")

  }

  async add(){
    const name = await this.prompt.fire("请输入新名称", "");
    if (name === null) {

    } else if (name === "") {
      const generateRandomName = (length = 4) => {
        const chars = '1234567890';
        let name = '';
        for (let i = 0; i < length; i++) {
          name += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return name;
      }
      const name= generateRandomName()
      const obj = {
        id: new Date().getTime().toString(),
        name: name,
        source: this.AppData.source,
      }
      await this.webDb.update('favorites_menu', obj)
      this.getAll()
      setTimeout(() => {
        window._gh_menu_update()
      })


    } else {
      if (name != "") {
        const obj = {
          id: new Date().getTime().toString(),
          name: name,
          source: this.AppData.source,
        }
        await this.webDb.update('favorites_menu', obj)
        this.getAll()
        setTimeout(() => {
          window._gh_menu_update()
        })
      }
    }
  }



}
