import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom, forkJoin, zip } from 'rxjs';
import { UploadService } from '../../services/upload.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ImportPdfService } from '../../services/import-pdf.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  constructor(
    private db: NgxIndexedDBService,
    public upload: UploadService,
    public importPdf: ImportPdfService,
    private http: HttpClient
  ) { }

  index = 0;

  beforeUploadImage = (file1: NzUploadFile, files: Array<NzUploadFile>): boolean => {
    this.index++;
    if (this.index == files.length) {
      this.upload.image(files)
      this.index = 0;
    }
    return false;
  };

  beforeUploadZip = (file1: NzUploadFile, files: Array<NzUploadFile>): boolean => {
    this.index++;
    if (this.index == files.length) {
      let arr = [];
      let index = 0;
      var zip = new JSZip();
      const name = `${files[0].name}`.split(".")[0];
      const _this = this;
      zip.loadAsync(files[0] as any).then(function () {
        const total = Object.keys(zip.files).length;
        zip.forEach(async function (relativePath, file) {
          if (!file.dir) {
            const imageType = ["gif", "png", "jpg ", "jpeg", " bmp", " webp"];
            var extension = file.name.split('.').pop().toLowerCase();
            if (imageType.includes(extension)) {
              const blob = await file.async("blob");
              const file1: any = new File([blob], file["name"], {
                type: `image/${extension}`
              })
              file1["relativePath"] = `${name}/${relativePath}`;
              arr.push(file1)
            }

          } else {
          }
          index++;
          if (index == total) {
            _this.upload.zip(arr)
          }
        });
      });
      this.index = 0;
    }
    return false;
  };
  beforeUploadPdf = (file: NzUploadFile, files: Array<NzUploadFile>): boolean => {
    const name = `${files[0].name}`.split(".")[0];
    var reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        let arr = [];
        const blobs = await this.importPdf.init(reader.result);
        blobs.forEach((blob, index) => {
          let f = new File([blob], file["name"], { type: blob.type });
          f["relativePath"] = `${name}/${index + 1}.jpeg`;
          arr.push(f)
        })
        this.upload.zip(arr)
      }
    };
    reader.readAsArrayBuffer(file as any)
    return false;
  };
}
