import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/f-aaa/userData';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private RimaAAAService: RimaAAAService
  ) {
    this.form = fb.group({
        // "cameraPhoto": ['', [Validators.required, Validators.email]],
        // "storagePhoto":["", [Validators.required, Validators.minLength(3)]]
        "cameraPhoto": ['', []],
        "storagePhoto":["", []]
    });
  }

  ngOnInit() {
  }

  get isLoggedIn():Boolean{
    return this.RimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.RimaAAAService.getUser();
  }

  reset() {
      this.form.reset();
  }

  onSubmit( ){
    console.log(this.form);
    let userData:UserData = new UserData();
    //TODO: userData.image.url = this.form.value.cameraPhoto;
    // this.RimaAAAService.createNewUser(userData, this.userCreated);
  }

}
