import { Component, OnInit } from '@angular/core';
import { I18nService } from 'src/app/library/public-api';
import { UploadService } from '../../services/upload.service';
import { UploadSelectService } from './upload-select.service';

@Component({
  selector: 'app-upload-select',
  templateUrl: './upload-select.component.html',
  styleUrls: ['./upload-select.component.scss']
})
export class UploadSelectComponent implements OnInit {
  github_json=[""];
  constructor(
    public uploadSelect: UploadSelectService,
    public i18n:I18nService,
    public upload: UploadService,
    ) {

  }
  // chapter roll roll_external pdfToImage
  ngOnInit(): void {
  }
  change(e) {
    if (e == "zip") (document.querySelector("#update_file_zip input") as any).click();
    if (e == "image") (document.querySelector("#update_file_image input") as any).click();
    if (e == "pdfToImage") (document.querySelector("#update_file_pdf input") as any).click();
    if (e == "github") {
      let arr=[];
      const json=this.github_json
      for (let i = 0; i < json.length; i++) {
        const name=json[i].split("/").at(-1);
        const imageType = ["gif", "png", "jpg ", "jpeg", " bmp", " webp"];
        var extension = name.split('.').pop().toLowerCase();
        const x = `/assets/images/${json[i]}`;
        let f = new File([], name, {
          type: `image/${extension}`
        });
        f["relativePath"] = `images/${json[i]}`;
        f["upload_type"] = `github_pages`;
        arr.push(f);
      }

      this.upload.zip(arr);
    }
    // this.uploadSelect.close();

  }
  ngAfterViewInit() {
    this.init();
    // setTimeout(()=>{
    //   const node=document.querySelector("#toolbar [_id=add_box]").getBoundingClientRect();
    //   const node2:any=document.querySelector(".upload_select")
    //   const marginRight=(window.innerWidth-(node.left+(node.width/2)+(node2.clientWidth/2)))
    //   node2.style.marginRight=`${marginRight>0?marginRight:0}px`;
    // })
  }

  async init() {
    try {
      const req = await fetch(location.href+'assets/images/index.json');
      if(!req.ok) return
      const json = await req.json();
      if(json.v2){
        this.github_json=json.v2;
      }

    } catch (error) {

    }

  }
}
