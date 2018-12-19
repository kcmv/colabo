import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Observable} from 'rxjs';
import { map, filter, startWith } from 'rxjs/operators';

import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';

// import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KMap} from '@colabo-knalledge/f-core/code/knalledge/kMap';

// import {NgForm} from '@angular/forms';
// import {Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';

@Component({
    selector: 'map-create-form',
    templateUrl: './map-create-form.html',
    styleUrls: ['./map-create-form.css']
})
export class MapCreateForm implements OnInit {

//   public selectedCountry:String;
  form: FormGroup;

  //an exmaple of defining a form control as independet
//   firstName:FormControl = new FormControl("", [Validators.required, Validators.minLength(2)]);

  constructor(
    fb: FormBuilder,
    private rimaAAAService: RimaAAAService
    // private bottomSheetRef: MatBottomSheetRef<MapCreateForm>
  ) {
      this.form = fb.group({
          // name: ['', [Validators.required,
          //   CustomValidators.validateCharacters //example of using custom validator imported from other service
          // ]],
        //   "email": ['', [Validators.required, Validators.email]],
          "name":["", [Validators.required, Validators.minLength(2)]]
        //   "password":["", [Validators.required, Validators.minLength(3)]]
      });

      this.form.valueChanges
        // example .map((value) => {
        //     value.firstName = value.firstName.toUpperCase();
        //     return value;
        // })
        .pipe(filter((value) => this.form.valid))
        .subscribe((value) => {
           console.log("Model Driven Form valid value: vm = ",
                       JSON.stringify(value));
        });
      //TODO: check if the user's email is already existing (offer sign-in instead and data updating)
  }

  ngOnInit() {
  }

  // fullUpdate() {
  //   this.form.setValue({firstName: 'Partial', password: 'monkey'});
  // }
  //
  // partialUpdate() {
  //     this.form.patchValue({firstName: 'Partial'});
  // }

//   get isRegistered(): Boolean {
//     return this.rimaAAAService.isRegistered;
//   }
  
//   get isLoggedIn():Boolean{
//     return this.rimaAAAService.getUser() !== null;
//   }

//   get loggedUser(): KNode {
//     return this.rimaAAAService.getUser();
//   }

//   logOut(){
//     this.rimaAAAService.logOut();
//   }
  reset() {
    this.form.reset();
  }

  onSubmit( ){
    console.log("model-based form submitted");
    console.log(this.form);
    let map:KMap = new KMap();
    map.name = this.form.value.name;

    // this.rimaAAAService.createNewUser(userData, this.userCreated.bind(this));

    ///
    if(this.creatingFunction){
        this.creatingFunction(true);
    }
  }

    // myControl = new FormControl();
    // public mapFormActive = true;
    // model = new KMap();

    private creatingFunction:Function=null;

    // openLink(event: MouseEvent): void {
    //     this.bottomSheetRef.dismiss();
    //     event.preventDefault();
    // }

    /*
    // TODO: Remove this when we're done
    get diagnostic() { return JSON.stringify(this.model); }

    // get debugging(){
    //   return
    // }

    show(map:KMap, creatingFunction:Function):void{
        console.log("[MapFormComponent].show");
        this.creatingFunction = creatingFunction;
        // this.mdDialog.show();
        this.mapFormActive = false;
        setTimeout(() => this.mapFormActive = true, 0.1);
        this.model = map;
    }

    close(confirm:boolean):void{
        console.log("[MapFormComponent].close:",confirm);
        // this.mdDialog.close();
        if(this.creatingFunction){
        this.creatingFunction(false);
        }
    }
    */
}
