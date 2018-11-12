import { Component, OnInit } from '@angular/core';
import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/f-aaa/userData';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';
import { MediaUploadService } from '../upload.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  constructor(
    protected mediaUploadService: MediaUploadService,
    protected RimaAAAService: RimaAAAService
  ) {
  }

  ngOnInit() {
  }

  get isLoggedIn():Boolean{
    return this.RimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.RimaAAAService.getUser();
  }

  onFileAdded(event){
    let fileList: FileList = event.target.files;
    this.mediaUploadService.uploadFileList(fileList).subscribe(val => {
      // if (val.json().status == 'success') {
      //   this.networkContract.FilePath = val.json().data.fileName;
      // }
      // console.log(val.json());
    });
  }

  onSubmit( ){
    // console.log(this.form);
    let userData:UserData = new UserData();
    //TODO: userData.image.url = this.form.value.cameraPhoto;
    // this.RimaAAAService.createNewUser(userData, this.userCreated);
  }

}
