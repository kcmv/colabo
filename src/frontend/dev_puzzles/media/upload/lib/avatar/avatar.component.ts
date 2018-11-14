import { Component, OnInit, ViewChild } from '@angular/core';
import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/f-aaa/userData';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';
import { MediaUploadService } from '../upload.service';
import * as config from '@colabo-utils/i-config';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  @ViewChild('file') file;
  public uploadStatus:string = 'avatar not sent';
  public fileAdded:boolean = false;
  public fileUploaded:boolean = false;

  constructor(
    protected mediaUploadService: MediaUploadService,
    protected rimaAAAService: RimaAAAService
  ) {
  }

  ngOnInit() {
  }

  get avatarImage(): string {
    return config.GetGeneral('imagesFolder') + '/user.avatar-' + this.rimaAAAService.getUserId() + '.jpg';
  }

  get isLoggedIn():Boolean{
    return this.rimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.rimaAAAService.getUser();
  }

  getPhoto(){
    this.file.nativeElement.click();
  }

  onFileAdded(event){
    this.fileAdded = true;

    // let fileList: FileList = event.target.files;
    // this.mediaUploadService.uploadFileList(fileList).subscribe(val => {
    //   // if (val.json().status == 'success') {
    //   //   this.networkContract.FilePath = val.json().data.fileName;
    //   // }
    //   // console.log(val.json());
    // });
  }

  onSubmit( ){
    // console.log(this.form);
    // let userData:UserData = new UserData();
    //TODO: userData.image.url = this.form.value.cameraPhoto;
    // this.rimaAAAService.createNewUser(userData, this.userCreated);
    let fileList: FileList = this.file.nativeElement.files;
    this.uploadStatus = 'avatar is being sent';
    this.mediaUploadService.uploadFileList(fileList).subscribe(val => {
      // if (val.json().status == 'success') {
      //   this.networkContract.FilePath = val.json().data.fileName;
      // }
      // console.log(val.json());
      this.uploadStatus = 'is sent';
      this.fileUploaded = true;
    });
  }
  
  reset(){
    this.uploadStatus = 'avatar not sent';
    this.fileAdded = false;
    this.fileUploaded = false;
  }
}
