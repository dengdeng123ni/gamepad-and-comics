

import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ImageService } from 'src/app/library/public-api';
interface Item { chapter_id: string, index: number, id: string, src: string, width: number, height: number }
@Component({
  selector: 'app-multiple-page-reader-mode1',
  templateUrl: './multiple-page-reader-mode1.component.html',
  styleUrls: ['./multiple-page-reader-mode1.component.scss']
})
export class MultiplePageReaderMode1Component {
  pages: Item[] = [];
  page_index = 0;

  change$;

  constructor(
    public current: CurrentService,
    public image: ImageService,
    public data: DataService
  ) {

    this.pages = this.data.pages.map(x => ({ ...x, chapter_id: this.data.chapter_id }));
    this.change$ = this.current.change().subscribe(x => {
      if (x.trigger == "up_down_page_reader") return
      if (x.type == "changePage") {
        this.pages = x.pages.map(c => ({ ...c, chapter_id: x.chapter_id }));
        this.pageChnage(x.page_index);
      } else if (x.type == "changeChapter") {
        this.pages = x.pages.map(c => ({ ...c, chapter_id: x.chapter_id }));
        this.pageChnage(x.page_index);
      } else if (x.type == "nextPage") {
        this.next()
      } else if (x.type == "previousPage") {
        this.previous()
      }
    })
  }
  ngOnDestroy() {
    this.change$.unsubscribe();

  }
  ngAfterViewInit() {
    const container = document.getElementById("multiple_page_reader_mode1")
    container.addEventListener("scroll", (event) => {
      if ((container.scrollHeight + container.clientHeight * 2.5) > container.scrollHeight) {
        this.loadNext()
      }
    });
    if (container) container.classList.remove("opacity-0");
    setTimeout(() => {
      this.pageChnage(this.data.page_index)
      this.getCurrentPage();
    }, 100)

    this.updata();

  }
  async updata() {
    setTimeout(async () => {
      this.getCurrentPage();
      const container = document.getElementById("multiple_page_reader_mode1")
      if (container) this.updata();
    }, 3000)
  }
  is_load = false
  async loadNext() {
    if (this.is_load) return
    this.is_load = true;
    const id = await this.current._getNextChapterId()
    const pages = await this.current._getChapter(id)
    this.data.chapter_id = id;
    for (let index = 0; index < pages.length; index++) {
      let obj: any = {};
      const img = await this.loadImage(pages[index].src)
      obj["id"] = pages[index].id;
      obj["src"] = img.src;
      obj["width"] = img.width;
      obj["height"] = img.height;
      obj["chapter_id"] = id;
      this.pages.push(obj)
    }
    this.is_load = false;
  }
  loadImage = async (url: string) => {
    url = await this.image.getImageBase64(url)
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

  async pageChnage(page_index: number) {
    const node = document.getElementById(`multiple_page_reader_mode1_${page_index}`);
    node!.scrollIntoView(true)
  }
  async getCurrentPage() {
    const nodes = document.querySelectorAll(".list app-image");
    var observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((change: any) => {
          if (change.isIntersecting || change.isVisible) {
            var container = change.target;
            const id = container.getAttribute('chapter_id');
            const index = parseInt(container.getAttribute('index'));
            this.current._change('changePage', { chapter_id: id, page_index: index, trigger: "up_down_page_reader" })
          } else {
            var container = change.target;
            const id = parseInt(container.getAttribute('id'));
            const index = parseInt(container.getAttribute('index'));
          }
        });
      }
    );
    nodes.forEach(node => observer.observe(node))
  }
  async next() {
    const id = await this.current._getNextChapterId();
    let pages = await this.current._getChapter(id)
    this.pages = pages.map(c => ({ ...c, chapter_id: id }));
  }
  async previous() {
    const id = await this.current._getPreviousChapterId();
    let pages = await this.current._getChapter(id)
    this.pages = pages.map(c => ({ ...c, chapter_id: id }));
  }
}
