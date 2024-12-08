import { Component, HostListener } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';


import { ChaptersListService } from '../chapters-list/chapters-list.service';
import { GamepadEventService, IndexdbControllerService } from 'src/app/library/public-api';

@Component({
  selector: 'app-novels-reader',
  templateUrl: './novels-reader.component.html',
  styleUrl: './novels-reader.component.scss'
})
export class NovelsReaderComponent {
  @HostListener('window:resize', ['$event'])
  resize = (event: KeyboardEvent) => {
    this.position = document.querySelector(".chapter").getBoundingClientRect();
  }
  list = [];

  title = '';
  author = '';
  novels_id = null;


  position = {
    left: 0,
    width: 0
  }
  change$
  is_destroy=false;
  constructor(
    public data: DataService,
    public current: CurrentService,
    public webDb: IndexdbControllerService,
    public ChaptersList: ChaptersListService,
    public GamepadEvent:GamepadEventService,
  ) {
    this.init();

    this.GamepadEvent.registerAreaEvent("novels_reader_v1", {
      "UP": () => {
        this.move("UP");
      },
      "DOWN": () => {
        this.move("DOWN");
      },
      "LEFT": () => {
        this.move("LEFT");
      },
      "RIGHT": () => {
        this.move("RIGHT");
      },
      "LEFT_BUMPER": () => {

      },
      "RIGHT_BUMPER": () => {
      },
      "B": () => this.back(),
      "A": () => {
        let node = document.querySelector("#novels_reader_v1");
        node.scrollTop = node.scrollTop + window.innerHeight;
      },
      "X": () => this.open(),
    })

    this.change$ = this.current.change().subscribe(x => {

      if (x.trigger == 'novels_reader_v1') return
      if(x.type == "changeChapter") {

        this.change(x.chapter_id)
      }

    })

  }
  ngOnDestroy() {
    this.change$.unsubscribe();
    this.is_destroy = true;
  }
  open() {
    this.ChaptersList.open({ width: `${this.position.width}px` })
  }
  move = (move) => {
    let node = document.querySelector("#novels_reader_v1");

    if (move == "UP" || move == "LEFT") {
      for (let i = 1; i < 21; i++) {
        setTimeout(() => {
          node.scrollLeft = node.scrollLeft - 10;
        }, 10 * i)
      }
    } else if (move == "DOWN" || move == "RIGHT") {
      for (let i = 1; i < 21; i++) {
        setTimeout(() => {
          node.scrollLeft = node.scrollLeft + 10;
        }, 10 * i)
      }
    }
  }
  async init() {
    this.title = this.data.details.title;
    this.author = this.data.details.author.map(x => x.name).toString();
    this.novels_id = this.data.comics_id;
    // const index = await this.getReadIndex(this.novels_id)
    // const id = this.data.chapters[index].id
    await this.addPages(this.data.chapter_id)
  }
  async change(chapter_id){
    this.list=[];
    await this.addPages(chapter_id);
  }


  async addPages(chapter_id) {
    const index = this.data.chapters.findIndex(x => x.id == chapter_id);
    const obj = this.data.chapters[index];
    const id = obj.id;
    const pages = await this.current._getChapter(id);

    if(!this.list.find(x=>x.id==id)){
      const lengths = pages.map(x => x.content.length)
      let length = 0;
      lengths.forEach(x => {
        length = length + x;
      })
      this.list.push({
        ...obj,
        index: index,
        pages: pages,
        length: length
      })
    }


    setTimeout(() => {
      this.position = document.querySelector(".chapter").getBoundingClientRect();
    }, 30)
  }

  async next() {
    const id = await this.current._getNextChapterId(this.list.at(-1).id)
    await this.addPages(id)
  }


  ngAfterViewInit() {
    setTimeout(() => {
      const container = document.getElementById("novels_reader_v1")
      container.addEventListener("scroll", (event) => {
        const { scrollTop, clientHeight, scrollHeight } = document.getElementById("novels_reader_v1");
        if ((scrollTop + clientHeight) >= (scrollHeight - 200)) { // 当滚动接近底部时
          this.next();
        }
      });
      this.updageRead();
    }, 400)


  }

  back() {
    window.history.back();
  }

  async getCurrentPage() {
    const nodes = document.querySelectorAll(".chapter");
    var observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((change: any) => {
          if (change.isIntersecting || change.isVisible) {
            var container = change.target;
            const index = parseInt(container.getAttribute("index"))
            this.saveRead(this.novels_id, index)
            observer.unobserve(container);
          } else {
            var container = change.target;
          }
        });
      }
    );
    nodes.forEach(node => observer.observe(node))
  }

  updageRead() {
    if (document.getElementById("novels_reader_v1")) {
      this.getCurrentPage();
      setTimeout(() => {
        this.updageRead();
      }, 5000)
    }
  }

  async saveRead(id, index: number) {
    this.current._change('changePage', {
      chapter_id:  this.data.chapters[index].id,
      trigger: 'novels_reader_v1'
    });
    await this.webDb.update("read_novels", { 'id': id.toString(), "index": index })
  }


  async getReadIndex(id) {
    const obj: any = await this.webDb.getByKey("read_novels", id.toString())
    if (obj) {
      return obj.index
    } else {
      return 0
    }
  }






}
