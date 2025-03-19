import { Injectable } from '@angular/core';
export interface WorkshopItemQueryConfig {
  cachedResponseMaxAge?: number
  includeMetadata?: boolean
  includeLongDescription?: boolean
  includeAdditionalPreviews?: boolean
  onlyIds?: boolean
  onlyTotal?: boolean
  language?: string
  matchAnyTag?: boolean
  requiredTags?: Array<string>
  excludedTags?: Array<string>
  searchText?: string
  rankedByTrendDays?: number
}
@Injectable({
  providedIn: 'root'
})
export class SteamModuleService {
  _data = {};
  constructor() {

    (window as any).electron.receiveMessage('steam_workshop', async (event, message) => {
      this._data[message.id] = message.data;


    })

    this.init();

  }

  async init(){


  }
  getUserItems(page: number,  WorkshopItemQueryConfig?: WorkshopItemQueryConfig | null | undefined) {
    let id = new Date().getTime().toString();

    let bool = true;

    this.sendMessage({
      type: "get_all_items",
      id:id,
      data:
        { page: page,
          WorkshopItemQueryConfig:WorkshopItemQueryConfig
        }
    });

    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data[id]) {

            r(this._data[id])
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        bool = false;
        r([])
        j([])
        this._data[id] = undefined;
      }, 40000)

    })
  }

  getAllItems(page: number, queryType: number, WorkshopItemQueryConfig?: WorkshopItemQueryConfig | null | undefined) {

    let id = new Date().getTime().toString();

    let bool = true;

    this.sendMessage({
      type: "get_all_items",
      id:id,
      data:
        { page: page,
          queryType: queryType,
          WorkshopItemQueryConfig:WorkshopItemQueryConfig
        }
    });

    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data[id]) {

            r(this._data[id])
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        bool = false;
        r([])
        j([])
        this._data[id] = undefined;
      }, 40000)

    })
  }

  getUserSubscribeItems() {

    let id = new Date().getTime().toString();

    let bool = true;

    this.sendMessage({
      type: "get_user_subscribe_items",
      id:id
    });

    return new Promise((r, j) => {
      const getData = () => {
        setTimeout(() => {
          if (this._data[id]) {

            r(this._data[id])
          } else {
            if (bool) getData()
          }
        }, 33)
      }
      getData()

      setTimeout(() => {
        bool = false;
        r([])
        j([])
        this._data[id] = undefined;
      }, 40000)

    })
  }




  sendMessage = (data) => {
    (window as any).electron.sendMessage('steam_workshop', data)
  }






}
