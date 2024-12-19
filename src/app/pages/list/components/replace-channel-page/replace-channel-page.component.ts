import { Component } from '@angular/core';
import { ReplaceChannelControllerService, ReplaceChannelEventService, WsControllerService } from 'src/app/library/public-api';

@Component({
  selector: 'app-replace-channel-page',
  templateUrl: './replace-channel-page.component.html',
  styleUrl: './replace-channel-page.component.scss'
})
export class ReplaceChannelPageComponent {
  list = [

  ]
  displayedColumns = ['position', 'name', 'id', 'operate'];
  is_enabled = true;
  constructor(
    public ReplaceChannelController: ReplaceChannelControllerService,
    public ReplaceChannelEvent: ReplaceChannelEventService,
    public WsController: WsControllerService
  ) {
    this.init()
  }

  closeReplace() {
    this.ReplaceChannelController.goBack();
  }
  async init() {
    const list = Object.keys(this.ReplaceChannelEvent.Configs);

    for (let index = 0; index < list.length; index++) {
      try {
        this.ReplaceChannelEvent.Events[list[index]].getAll().then(res => {
          res.forEach((e, i) => {
            e.replace_channel_id = list[index];
          });
          this.list = [...this.list, ...res]
          this.list.forEach((e, i) => {
            e.index = i + 1
          });
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  async change(e) {
    this.WsController.receiver_client_id = e.id;
    this.ReplaceChannelController.change(e.id, e.replace_channel_id, this.ReplaceChannelController.is_enabled)
  }

  change123() {
    setTimeout(() => {
      this.ReplaceChannelController.enabled_change(this.ReplaceChannelController.is_enabled)
    })
  }

}
