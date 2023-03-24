import { Component } from '@angular/core';
import { GamepadEventService } from 'src/app/library/public-api';
import { ConfigReaderService } from '../../services/config.service';
import { CurrentReaderService } from '../../services/current.service';
import { ReaderNavbarBarService } from '../reader-navbar-bar/reader-navbar-bar.service';

@Component({
  selector: 'app-mode3',
  templateUrl: './mode3.component.html',
  styleUrls: ['./mode3.component.scss']
})
export class Mode3Component {
  images = [];
  index = 0;
  total = 0;
  id = "";
  chapters = [];
  steps = 0;

  afterInit$ = null;
  chapter$ = null;

  page$ = null;
  switch$ = null;
  nextPage$ = null;
  previousPage$ = null;

  constructor(
    public current: CurrentReaderService,
    public config: ConfigReaderService,
    public GamepadEvent: GamepadEventService,
    public ReaderNavbarBar: ReaderNavbarBarService
  ) {
    GamepadEvent.registerAreaEvent('reader_mode_3', {
      UP: () => {
        let node = document.querySelector("#mode3");
        for (let i = 1; i < 41; i++) {
          setTimeout(() => {
            node.scrollLeft = node.scrollLeft - 3;
          }, 10 * i)
        }
      },
      LEFT: () => {
        let node = document.querySelector("#mode3");
        for (let i = 1; i < 41; i++) {
          setTimeout(() => {
            node.scrollLeft = node.scrollLeft - 3;
          }, 10 * i)
        }
      },
      RIGHT: () => {
        let node = document.querySelector("#mode3");
        for (let i = 1; i < 41; i++) {
          setTimeout(() => {
            node.scrollLeft = node.scrollLeft + 3;
          }, 10 * i)
        }
      },
      DOWN: () => {
        let node = document.querySelector("#mode3");
        for (let i = 1; i < 41; i++) {
          setTimeout(() => {
            node.scrollLeft = node.scrollLeft + 3;
          }, 10 * i)
        }
      },
      X: () => {
        this.current.previousPage$.next(true);
      },
      A: () => {
        this.current.nextPage$.next(true);
      },
      B: () => {
        window.history.back();
      },
      LEFT_BUMPER: () => {

      },
      RIGHT_BUMPER: () => {

      },
      RIGHT_ANALOG_PRESS: () => {
        this.ReaderNavbarBar.isToggle();
      },
      LEFT_TRIGGER: () => {
        current.previous()
      },
      RIGHT_TRIGGER: () => {
        current.next();
      }
    })
    const { id, index } = this.current.comics.chapter;
    const { chapters } = this.current.comics;
    const chapter = chapters.find(x => x.id == id);
    const images = chapter.images;
    this.images = images;
    this.index = index;
    this.total = images.length;


    this.chapter$ = this.current.chapter().subscribe(async x => {
      const { id, index } = this.current.comics.chapter;
      const { chapters } = this.current.comics;
      const chapter = chapters.find(x => x.id == id);
      const images = chapter.images;
      this.images = images;
      this.index = index;
      this.total = images.length;
      document.getElementById("mode3").classList.add("opacity-0");
      this.init(this.images[this.index].id)
    })

    this.page$ = this.current.page().subscribe(async (index: number) => {
      const id = this.images[index].id
      const node = document.getElementById(id);
      node.scrollIntoView(true)
    })
    this.nextPage$ = this.current.nextPage().subscribe(() => {
      const index = this.current.comics.chapter.index + 1;
      this.current.pageChange(index)
    })
    this.previousPage$ = this.current.previousPage().subscribe(() => {
      const index = this.current.comics.chapter.index - 1;
      this.current.pageChange(index)
    })

  }
  ngOnDestroy() {
    this.chapter$.unsubscribe();
    this.page$.unsubscribe();
    this.nextPage$.unsubscribe();
    this.previousPage$.unsubscribe();
  }
  ngAfterViewInit() {
    document.getElementById("mode3").classList.add("opacity-0");
    this.init(this.images[this.index].id)
  }

  loadImage = (url: string) => {
    return new Promise<any>((resolve, reject) => {
      if (url) {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject({ width: 0, height: 0 });
        img.src = url;
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  }
  async init(id) {
    const container = document.getElementById("mode3")
    for (let i = 0; i < this.images.length; i++) {
      const x = this.images[i];
      await this.loadImage(x.src)
    }
    let list = [];
    const node = document.getElementById(id);
    node.scrollIntoView(true)
    container.classList.remove("opacity-0");
    const nodes = document.querySelectorAll(".list img");
    nodes.forEach(x => list.push(x.getBoundingClientRect()))
    var observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((change: any) => {
          if (change.isIntersecting || change.isVisible) {
            var container = change.target;
            const id = parseInt(container.getAttribute('id'));
            const index = parseInt(container.getAttribute('index'));
            this.start(id, index)
          } else {
            var container = change.target;
            const id = parseInt(container.getAttribute('id'));
            const index = parseInt(container.getAttribute('index'));
            this.end(id, index)
          }
        });
      }
    );
    nodes.forEach(node => observer.observe(node))
  }
  list = [];
  start(id, index) {
    this.list.push({ id: id, index: index, startTime: new Date().getTime() })

  }
  end(id, index) {
    const update = (imageId, chapterId, comicsId, startTime, endTime) => {
      this.current.imageReadingTime$.next({ id: new Date().getTime(), imageId: id, chapterId: chapterId, comicsId: comicsId, startTime: startTime, endTime: endTime })
    }
    const index1 = this.list.findIndex(x => x.id == id)
    if (index1 > -1) {
      const endTime = new Date().getTime()
      let obj = this.list[index1];
      if ((endTime - obj.startTime) > 6000){
        this.current.comics.chapter.index = index;
        this.current.update_state(this.current.comics.chapter, index);
      }
      update(obj.id, this.current.comics.chapter.id, this.current.comics.id, obj.startTime, endTime)
      this.list.splice(index1, 1)
    }
  }
}
