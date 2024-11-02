import { Injectable } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  constructor(
    public current: CurrentService,
    public data: DataService,
    public GamepadEvent: GamepadEventService,
  ) {

  }
}
