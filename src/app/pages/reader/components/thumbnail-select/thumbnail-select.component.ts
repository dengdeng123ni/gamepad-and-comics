import { Component } from '@angular/core';
import { SidebarLeftService } from '../sidebar-left/sidebar-left.service';
import { SlideBottomService } from '../slide-bottom/slide-bottom.service';
import { ThumbnailService } from '../thumbnail-list/thumbnail.service';
import { SquareThumbnailService } from '../square-thumbnail/square-thumbnail.service';
import { ThumbnailSelectService } from './thumbnail-select.service';

@Component({
  selector: 'app-thumbnail-select',
  templateUrl: './thumbnail-select.component.html',
  styleUrls: ['./thumbnail-select.component.scss']
})
export class ThumbnailSelectComponent {
  constructor(
    public thumbnail: ThumbnailService,
    public slideBottom: SlideBottomService,
    public left: SidebarLeftService,
    public SquareThumbnail: SquareThumbnailService,
    public thumbnailSelect:ThumbnailSelectService
  ) {

  }
  close(){
    this.thumbnailSelect.close();
  }
}
