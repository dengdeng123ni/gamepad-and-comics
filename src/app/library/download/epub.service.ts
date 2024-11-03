// @ts-nocheck
import { Injectable } from '@angular/core';
import getTemplateContainerXml from './template/container.xml'
import getTemplatePageXhtml from './template/page.xhtml'
import getTemplateFixedLayoutJpCss from './template/fixed-layout-jp.css'
import getTemplateStandardOpf from './template/standard.opf'
import getTemplateNavigationDocumentsXhtml from './template/navigation-documents.xhtml'
import { ImageService } from '../public-api';

declare const JSZip: any;
@Injectable({
  providedIn: 'root'
})
export class EpubService {
  uuid = () => {
    const char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    let uuid = ""
    let i = 36

    while (i-- > 0) {
      if (i === 27 || i === 22 || i === 17 || i === 12) {
        uuid = uuid + "-"
      } else {
        uuid = uuid + String(char[Math.ceil(Math.random() * 35)])
      }
    }

    return uuid
  }

  book = {
    bookID: this.uuid(),
    bookTitle: '',
    bookAuthors: [],
    bookSubject: '',
    bookPublisher: '',
    pageSize: [250, 353],
    pagePosition: 'between',
    pageShow: 'two',
    pageFit: 'stretch',
    pageBackgroundColor: 'white',
    pageDirection: 'right',
    coverPosition: 'first-page',//  alone
    pages: [],
    savedSets: []
  }
  contents = {
    indexMap: {
      0: 0
    },
    list: [{
      pageIndex: 0,
      title: '表紙'
    }]
  }

  blobs = [];

  constructor(public image: ImageService) { }



  async createEpub(
    list: Array<string>, {
      isFirstPageCover = false,
      page = "double",
      pageOrder = false
    }) {
    const { width, height } = await this.getImageAllWH(list);
    if (width < height) {
      this.book.pageSize[0] = width;
      this.book.pageSize[1] = height;
    } else {
      this.book.pageSize[0] = width / 2;
      this.book.pageSize[1] = height;
    }
    let arr = [];
    console.log(list);

    if (pageOrder) arr = await this.pageDouble(list, false)
    else arr = await this.pageDouble_reverse(list, false)

    if (pageOrder) {
      this.book.pageDirection = 'left'
    } else {
      this.book.pageDirection = 'right'
    }

    for (let index = 0; index < arr.length; index++) {
      const x = arr[index];


      if (index == 0&&x.images.length == 1) {
        let blob = await this.separate123(x.images[0].img)
        this.blobs.push(blob)
      } else if (x.images.length == 1) {
        var img = await this.createImage(x.images[0].img) as any;
        let canvas = document.createElement('canvas');
        canvas.width = x.page.width;
        canvas.height = x.page.height;
        let context = canvas.getContext('2d');
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgb(255,255,255)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        console.log(canvas.width, canvas.height);

        context.drawImage(img, x.images[0].x, x.images[0].y, x.images[0].width, x.images[0].height);
        let dataURL = canvas.toDataURL("image/jpeg",0.83);
        let blobs = await this.separateImage(dataURL);
        if (pageOrder) {
          this.blobs.push(blobs[0])
          this.blobs.push(blobs[1])
        } else {
          this.blobs.push(blobs[1])
          this.blobs.push(blobs[0])
        }
      } else if (x.images.length == 2) {
        const imageToblob = (img) => {
          let canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          let context = canvas.getContext('2d');
          context.rect(0, 0, canvas.width, canvas.height);
          context.fillStyle = "rgb(255,255,255)";
          context.fillRect(0, 0, canvas.width, canvas.height);
          console.log(canvas.width, canvas.height);

          context.drawImage(img, 0, 0, img.width, img.height);
          let dataURL = canvas.toDataURL("image/jpeg",0.83);
          const blob = this.base64ToBlob(dataURL, "jpeg");
          return blob
        }
        var img = await this.createImage(x.images[0].img) as any;
        var img1 = await this.createImage(x.images[1].img) as any;
        const blob1 = imageToblob(img)
        const blob2 = imageToblob(img1)
        if (pageOrder) {
          this.blobs.push(blob1)
          this.blobs.push(blob2)
        } else {
          this.blobs.push(blob2)
          this.blobs.push(blob1)
        }
      }

      // images.push(blob);
    }

    for (let i = 0; i < this.blobs.length; i++) {
      this.book.pages.push({
        index: i,
        sticky: 'auto',
        blank: false,
      })
    }
    const blob = await this.generateBook();
    this.blobs = [];
    this.book.pages = [];
    return blob
  }
  async separate123(src) {
    const img: any = await this.createImage(src);
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.book.pageSize[0];
    canvas.height = this.book.pageSize[1];

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);

    // 计算缩放后的宽高
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    // 计算绘制的起始位置以居中
    const x = (canvas.width - drawWidth) / 2;
    const y = (canvas.height - drawHeight) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    let dataURL1 = canvas.toDataURL("image/jpeg",0.83);
    const blob1 = this.base64ToBlob(dataURL1, "jpeg")
    return blob1
  }
  async getImageAllWH(list) {
    let width_s = [];
    let height_s = []
    for (let i = 0; i < list.length; i++) {
      const img: any = await this.createImage(list[i]);
      width_s.push(img.width)
      height_s.push(img.height)
    }
    return { width: this.median(width_s), height: this.median(height_s) }
  }
  median(nums) {
    nums.sort(function (a, b) {
      return a - b;
    });

    var middle = Math.floor(nums.length / 2);

    if (nums.length % 2 === 0) {
      return (nums[middle - 1] + nums[middle]) / 2;
    } else {
      return nums[middle];
    }
  }
  createCover() {
    let canvas4 = document.createElement('canvas');
    canvas4.width = this.book.pageSize[0];
    canvas4.height = this.book.pageSize[1];
    let context4 = canvas4.getContext('2d');
    context4.rect(0, 0, canvas4.width, canvas4.height);
    let dataURL1 = canvas4.toDataURL("image/jpeg",0.83);
    const blob1 = this.base64ToBlob(dataURL1, "jpeg");
    return blob1
  }
  async separateImage(src) {
    const image1: any = await this.createImage(src);
    let canvas1 = document.createElement('canvas');
    canvas1.width = (image1.width / 2);
    canvas1.height = image1.height;
    let context1 = canvas1.getContext('2d');
    context1.rect(0, 0, canvas1.width, canvas1.height);
    context1.drawImage(image1, 0, 0, image1.width, image1.height, 0, 0, image1.width, image1.height);

    let canvas2 = document.createElement('canvas');
    canvas2.width = (image1.width / 2);
    canvas2.height = image1.height;
    let context2 = canvas2.getContext('2d');
    context2.rect(0, 0, canvas2.width, canvas2.height);

    context2.drawImage(image1, canvas1.width, 0, image1.width, image1.height, 0, 0, image1.width, image1.height);
    let dataURL1 = canvas1.toDataURL("image/jpeg",0.83);
    let dataURL2 = canvas2.toDataURL("image/jpeg",0.83);

    const image2: any = await this.createImage(dataURL1);
    let canvas3 = document.createElement('canvas');
    canvas3.width = this.book.pageSize[0];
    canvas3.height = this.book.pageSize[1];
    let context3 = canvas3.getContext('2d');
    const height = this.book.pageSize[0] * (image2.height / image2.width)
    // context3.rect(0, 0, canvas1.width, canvas1.height);
    context3.fillStyle = "rgb(255,255,255)";
    context3.fillRect(0, 0, canvas3.width, canvas3.height);
    context3.drawImage(image2, 0, (this.book.pageSize[1] - height) / 2, this.book.pageSize[0], height);


    const image3: any = await this.createImage(dataURL2);
    let canvas4 = document.createElement('canvas');
    canvas4.width = this.book.pageSize[0];
    canvas4.height = this.book.pageSize[1];
    let context4 = canvas4.getContext('2d');
    const height2 = this.book.pageSize[0] * (image3.height / image3.width)
    // context4.rect(0, 0, canvas4.width, canvas4.height);
    context4.fillStyle = "rgb(255,255,255)";
    context4.fillRect(0, 0, canvas4.width, canvas4.height);
    context4.drawImage(image3, 0, (this.book.pageSize[1] - height2) / 2, this.book.pageSize[0], height2);

    let dataURL3 = canvas3.toDataURL("image/jpeg",0.83);
    let dataURL4 = canvas4.toDataURL("image/jpeg",0.83);
    const blob1 = this.base64ToBlob(dataURL3, "jpeg");
    const blob2 = this.base64ToBlob(dataURL4, "jpeg");


    return [blob1, blob2]
  }
  base64ToBlob(urlData, type) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || type;
    // 去掉url的头，并转化为byte
    let bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mime
    });
  }
  generateBook() {
    const htmlToEscape = (str: string): string => {
      // eslint-disable-next-line no-control-regex
      const reg = /"|&|'|\\!|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g

      return str.replace(reg, ($0) => {
        let c: any = $0.charCodeAt(0)
        let r = ['&#']

        c = (c === 0x20) ? 0xA0 : c
        r.push(c)
        r.push(';')
        return r.join('')
      })
    }
    const getNumberStr = (num: number, zeroCount: number): string => {
      let str = String(num)
      let i = zeroCount - str.length
      while (i-- > 0) {
        str = '0' + str
      }
      return str
    }
    let templateContainerXml = getTemplateContainerXml()
    let templatePageXhtml = getTemplatePageXhtml()
    let templateFixedLayoutJpCss = getTemplateFixedLayoutJpCss()
    let templateStandardOpf = getTemplateStandardOpf()
    let templateNavigationDocumentsXhtml = getTemplateNavigationDocumentsXhtml()

    const Zip = new JSZip()

    Zip.folder('META-INF')
    Zip.folder('OEBPS/image')
    Zip.folder('OEBPS/text')
    Zip.folder('OEBPS/style')

    templateNavigationDocumentsXhtml = templateNavigationDocumentsXhtml.replace(
      '<!-- navigation-list -->',
      Object.keys(this.contents.indexMap).map((pageIndex) => {
        const listIndex = this.contents.indexMap[pageIndex]
        const contentItem = this.contents.list[listIndex]
        const title = htmlToEscape(contentItem.title)

        if (pageIndex === '0') {
          return `<li><a href="text/p_cover.xhtml">${title}</a></li>`
        }

        return `<li><a href="text/p_${getNumberStr(+pageIndex - 1, 4)}.xhtml">${title}</a></li>`
      }).join('\n')
    )

    let imageItemStr: string[] = []
    let pageItemStr: string[] = []
    let itemRefStr: string[] = []
    let spread = this.book.coverPosition === 'first-page'
      ? this.book.pageDirection
      : this.book.pageDirection === 'left'
        ? 'right'
        : 'left'

    this.book.pages.forEach((pageItem, i) => {
      const numStr = i === 0 ? 'cover' : getNumberStr(i - 1, 4)
      const imageFileName = (i === 0 ? '' : 'i_') + numStr

      if (pageItem.blank) {
        pageItemStr.push(`<item id="p_${numStr}" href="text/p_${numStr}.xhtml" media-type="application/xhtml+xml" properties="svg"></item>`)
      } else {
        const mimeType = this.blobs[i].type // image/xxxxx
        pageItemStr.push(`<item id="p_${numStr}" href="text/p_${numStr}.xhtml" media-type="application/xhtml+xml" properties="svg" fallback="${imageFileName}"></item>`)
        imageItemStr.push(`<item id="${imageFileName}" href="image/${imageFileName}.${mimeType.slice(6)}" media-type="${mimeType}"${i === 0 ? ' properties="cover-image"' : ''}></item>`)
      }

      if (i !== 0) {
        itemRefStr.push(`<itemref linear="yes" idref="p_${numStr}" properties="page-spread-${spread}"></itemref>`)
        spread = spread === 'left' ? 'right' : 'left'
      }
    })

    if (this.book.coverPosition === 'alone') {
      pageItemStr.splice(0, 1)
    } else { // this.book.coverPosition === 'first-page'
      itemRefStr.unshift(`<itemref linear="yes" idref="p_cover" properties="rendition:page-spread-center"></itemref>`)
    }

    const viewPortWidth = this.book.pageSize[0] + ''
    const viewPortHeight = this.book.pageSize[1] + ''
    const fitMode = this.book.pageFit
    const bookTitle = htmlToEscape(this.book.bookTitle.trim())

    this.book.pages.forEach((pageItem, i) => {
      const numStr = i === 0 ? 'cover' : getNumberStr(i - 1, 4)

      if (pageItem.blank) {
        Zip.file(
          `OEBPS/text/p_${numStr}.xhtml`,
          templatePageXhtml
            .replace('{{title}}', bookTitle)
            .replace(new RegExp('{{width}}', 'gm'), viewPortWidth)
            .replace(new RegExp('{{height}}', 'gm'), viewPortHeight)
            .replace('{{image}}', '')
        )
        return
      }

      const blob = this.blobs[i]
      const mimeType = blob.type.slice(6)
      const imageFileName = (i === 0 ? '' : 'i_') + numStr + '.' + mimeType

      let par = 'none'
      if (fitMode !== 'stretch') {
        par = this.book.pagePosition === 'center'
          ? 'xMidYMid '
          : this.book.pageDirection === 'left'
            ? (i + 1) % 2 === 1 ? 'xMaxYMid ' : 'xMinYMid '
            : (i + 1) % 2 === 1 ? 'xMinYMid ' : 'xMaxYMid '

        if (fitMode === 'fit') {
          par += 'meet'
        } else { // props.imageFit === 'fill'
          par += 'slice'
        }
      }

      Zip.file(
        `OEBPS/text/p_${numStr}.xhtml`,
        templatePageXhtml
          .replace('{{title}}', bookTitle)
          .replace(new RegExp('{{width}}', 'gm'), viewPortWidth)
          .replace(new RegExp('{{height}}', 'gm'), viewPortHeight)
          .replace('{{image}}', `<image width="100%" height="100%" preserveAspectRatio="${par}" xlink:href="../image/${imageFileName}" />`)
      )

      Zip.file(`OEBPS/image/${imageFileName}`, blob)
    })

    let authorsStr = this.book.bookAuthors.map((name, i) => {
      return [
        `<dc:creator id="creator${i + 1}">${htmlToEscape(name)}</dc:creator>`,
        `<meta refines="#creator${i + 1}" property="role" scheme="marc:relators">aut</meta>`,
        `<meta refines="#creator${i + 1}" property="file-as"></meta>`,
        `<meta refines="#creator${i + 1}" property="display-seq">${i + 1}</meta>`
      ].join('\n')
    }).join('\n')

    templateStandardOpf = templateStandardOpf
      .replace('{{uuid}}', this.book.bookID)
      .replace('{{title}}', bookTitle)
      .replace('<!-- creator-list -->', authorsStr)
      .replace('{{subject}}', htmlToEscape(this.book.bookSubject))
      .replace('{{publisher}}', htmlToEscape(this.book.bookPublisher))
      .replace('{{spread}}', this.book.pageShow === 'one' ? 'none' : 'landscape')
      .replace('{{createTime}}', new Date().toISOString())
      .replace(new RegExp('{{width}}', 'gm'), viewPortWidth)
      .replace(new RegExp('{{height}}', 'gm'), viewPortHeight)
      .replace('<!-- item-image -->', imageItemStr.join('\n'))
      .replace('<!-- item-xhtml -->', pageItemStr.join('\n'))
      .replace('<!-- itemref-xhtml -->', itemRefStr.join('\n'))
      .replace('{{direction}}', this.book.pageDirection === 'right' ? ' page-progression-direction="rtl"' : '')

    Zip.file('mimetype', 'application/epub+zip')
    Zip.file('META-INF/container.xml', templateContainerXml)
    Zip.file('OEBPS/style/fixed-layout-jp.css', templateFixedLayoutJpCss)
    Zip.file('OEBPS/navigation-documents.xhtml', templateNavigationDocumentsXhtml)
    Zip.file('OEBPS/standard.opf', templateStandardOpf)

    return Zip.generateAsync({
      type: 'blob',
      mimeType: 'application/epub+zip'
    })
  }
  compressImage = async (src) => {
    if (!src) {
      return {
        width: 0,
        height: 0
      }
    }
    const image1 = await this.createImage(src) as any;
    let canvas = document.createElement('canvas');
    canvas.width = image1.width;
    canvas.height = image1.height;
    if (canvas.width > canvas.height) {
      canvas.width = this.book.pageSize[0] * 2;
      canvas.height = this.book.pageSize[0] * 2 * (image1.height / image1.width);
    } else {
      canvas.width = this.book.pageSize[0];
      canvas.height = this.book.pageSize[0] * (image1.height / image1.width);
    }
    let context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);
    context.drawImage(image1, 0, 0, canvas.width, canvas.height);
    let dataURL = canvas.toDataURL("image/jpeg",0.83);
    return new Promise((r, j) => {
      var img = new Image();
      img.src = dataURL;
      img.onload = function () {
        r(img)
        j(img)
      };
    })
  }
  pageDouble = async (list, isFirstPageCover) => {
    let arr = [];
    for (let i = 0; i < list.length;) {
      const img: any = await this.compressImage(list[i]);
      const img1: any = await this.compressImage(list[i + 1]);
      if (img.height > img.width && img1.height > img1.width) {
        if (i == 0) {
          arr.push({
            page: {
              width: img.width,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        } else {
          arr.push({
            page: {
              width: img.width + img1.width,
              height: ((img.height + img1.height) / 2)
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: ((img.height + img1.height) / 2)
            }, {
              x: img.width,
              y: 0,
              img: img1.src,
              width: img1.width,
              height: ((img.height + img1.height) / 2)
            }]
          })
          i++;
          i++;
        }
      } else if (img.height < img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else if (img.height > img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width * 2,
            height: img.height
          },
          images: [{
            x: img.width,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else {
        if ((i + 1) == list.length) {
          if (img.height < img.width) {
            arr.push({
              page: {
                width: img.width,
                height: img.height
              },
              images: [{
                x: 0,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          } else {
            arr.push({
              page: {
                width: img.width * 2,
                height: img.height
              },
              images: [{
                x: 0,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          }
        } else {
          arr.push({
            page: {
              width: img.width,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        }
      }
    }
    return arr
  }
  pageDouble_reverse = async (list, isFirstPageCover) => {
    let arr = [];
    for (let i = 0; i < list.length;) {
      const img: any = await this.compressImage(list[i]);
      const img1: any = await this.compressImage(list[i + 1]);
      if (img.height > img.width && img1.height > img1.width) {
        if (i == 0) {
          arr.push({
            page: {
              width: img.width,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        } else {
          arr.push({
            page: {
              width: img.width + img1.width,
              height: ((img.height + img1.height) / 2)
            },
            images: [{
              x: 0,
              y: 0,
              img: img1.src,
              width: img1.width,
              height: ((img.height + img1.height) / 2)
            }, {
              x: img1.width,
              y: 0,
              img: img.src,
              width: img.width,
              height: ((img.height + img1.height) / 2)
            }]
          })
          i++;
          i++;
        }
      } else if (img.height < img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else if (img.height > img.width && img1.height < img1.width) {
        arr.push({
          page: {
            width: img.width * 2,
            height: img.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img.src,
            width: img.width,
            height: img.height
          }]
        })
        i++;
        arr.push({
          page: {
            width: img1.width,
            height: img1.height
          },
          images: [{
            x: 0,
            y: 0,
            img: img1.src,
            width: img1.width,
            height: img1.height
          }]
        })
        i++;
      } else {
        if ((i + 1) == list.length) {
          if (img.height < img.width) {
            arr.push({
              page: {
                width: img.width,
                height: img.height
              },
              images: [{
                x: 0,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          } else {
            arr.push({
              page: {
                width: img.width * 2,
                height: img.height
              },
              images: [{
                x: img.width,
                y: 0,
                img: img.src,
                width: img.width,
                height: img.height
              }]
            })
            i++;
          }
        } else {
          arr.push({
            page: {
              width: img.width,
              height: img.height
            },
            images: [{
              x: 0,
              y: 0,
              img: img.src,
              width: img.width,
              height: img.height
            }]
          })
          i++;
        }
      }
    }
    return arr
  }

  createImage = async (imageUrl) => {
    if (!imageUrl) return { width: 0, height: 0 }
    return await createImageBitmap(await this.image.getImageBlob(imageUrl))
  }

}
