const MODULE_NAME: string = "@colabo-media/f-upload";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {GetPuzzle} from '@colabo-utils/i-config';
import {RimaAAAService} from '@colabo-rima/f-aaa';
import * as config from '@colabo-utils/i-config';

const fileName = 'avatar';

@Injectable()
export class MediaUploadService{
  protected puzzleConfig:any;
  protected serverUrl:string;

  constructor(
    protected http: HttpClient,
    protected rimaAAAService:RimaAAAService
  ) {
    this.puzzleConfig = GetPuzzle(MODULE_NAME);
    this.init();
  }
 
  /**
  * Initializes service
  */
  init(){
    // RESTfull backend API url
    this.serverUrl = config.GetGeneral('serverUrl');    
  }

  handleError(error: Response) {
    console.error(error);
    return Observable.throw((error) || 'Server error');
  }
  
  // http://code.hootsuite.com/html5/
  // https://www.codepool.biz/take-a-photo-and-upload-it-on-mobile-phones-with-html5.html
  // https://developers.google.com/web/updates/2016/12/imagecapture
  // readFile(file) {
  //   var reader = new FileReader();

  //   reader.onloadend = function () {
  //     processFile(reader.result, file.type);
  //   }

  //   reader.onerror = function () {
  //     alert('There was an error reading the file!');
  //   }

  //   reader.readAsDataURL(file);
  // }
  
  // fixImagesSize(){
  //   this.readFile();
  // }

  // https://developer.mozilla.org/en-US/docs/Web/API/FormData
  // https://malcoded.com/posts/angular-file-upload-component-with-express
  // https://www.c-sharpcorner.com/article/how-to-post-formdata-to-webapi-using-angularjs2/
  uploadFileList(fileList: FileList){
    let iAmId:string = this.rimaAAAService.getUserId();
    // if(!iAmId)

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let fileSize: number = file.size;
      // disabled condition
      // if (true || fileSize <= 10485760) {
        let formData: FormData = new FormData();
        formData.append(fileName, file);
        formData.append('uploadtype', 'user.avatar');
        formData.append('iamid', iAmId);

        return this.http.post(this.serverUrl+"/upload", formData)
          .pipe(
            map((response: Response) => {
              return response;
            }),
            catchError(this.handleError)
          );

      // }else {
      //   console.error("File size is exceeded");
      // }
    }else {
      console.error("Something went Wrong.");
    }
  }
}
