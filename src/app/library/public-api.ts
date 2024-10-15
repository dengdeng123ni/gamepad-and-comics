/*
 * Public API Surface of library
 */

export * from './context-menu/context-menu-controller.service';
export * from './context-menu/context-menu-event.service';
export * from './context-menu/context-menu/context-menu.component';

export * from './image/image.service';
export * from './image/image.component';

export * from './gamepad/gamepad-explanation/gamepad-explanation.component';
export * from './gamepad/gamepad-vioce/gamepad-vioce.component';
export * from './gamepad/gamepad-controller.service';
export * from './gamepad/gamepad-event.service';
export * from './gamepad/gamepad-input.service';
export * from './gamepad/gamepad-sound.service';
export * from './gamepad/keyboard-event.service';

// export * from './cache/cache.service';
export * from './download/download.service';
export * from './i18n/i18n.service';
export * from './data/data.service';
export * from './db/db-controller.service';
export * from './db/db-event.service';

// export * from './temporary-file/temporary-file.service'
export * from './message/message-controller.service'
export * from './message/message-event.service'
export * from './message/message-fetch.service'
export * from './worker/worker.service'

export * from './utils/utils.service'

export * from './query/query-controller.service'
export * from './query/query-event.service'
export * from './history/history.service'
export * from './history-comics-list/history-comics-list.service'

export * from './pulg/pulg.service'

export * from './routing-controller.service'


export * from './image/image-to-controller.service'
export * from './local-cach.service'
export * from './read-record/read-record.service'
export * from './tab.service'
export * from './svg.service'
export * from './web-file.service'

export * from './custom-route-reuse-strategy'

export interface PagesItem { id: string,index:number,src: string, width: number, height: number }
interface StylesItem { id?: string, name: string, href?: string }
interface AuthorItem { id?: string, name: string, href?: string }
export interface ComicsInfo {
  cover: string,
  title: string,
  sub_title?:string,
  author?: Array<AuthorItem> | string,
  intro?: string,
  styles?: Array<StylesItem>,
  chapter_id: string,
  author_href?:string,
  href?:string
  origin?:string
}


export interface ChaptersItem {
  id: string,
  cover: string,
  title: string,
  pub_time?: string | Date | number,
  read?: number,
  selected?: boolean,
  is_locked?: boolean
}

export interface ComicsItem { id: string | number,origin?:string, cover: string, title: string, subTitle: string, selected?: boolean }
