const MODULE_NAME: string = "@colabo-media/f-upload";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {GetPuzzle} from '@colabo-utils/i-config';
import {RimaAAAService} from '@colabo-rima/f-aaa';

@Injectable()
export class MediaUploadService{
  protected puzzleConfig:any;

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
    
  }

  handleError(error: Response) {
    console.error(error);
    return Observable.throw((error.json()) || 'Server error');
  }

  uploadFileList(fileList: FileList){
    let iAmId:string = this.rimaAAAService.getUserId();
    // if(!iAmId)

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let fileSize: number = file.size;
      if (fileSize <= 10485760) {
        let formData: FormData = new FormData();
        formData.append('avatar', file);
        formData.append('iAmId', iAmId);

        return this.http.post("upload", formData)
          .pipe(
            map((response: Response) => {
              return response;
            }),
            catchError(this.handleError)
          );

      }else {
        console.error("File size is exceeded");
      }
    }else {
      console.error("Something went Wrong.");
    }
  }
}
