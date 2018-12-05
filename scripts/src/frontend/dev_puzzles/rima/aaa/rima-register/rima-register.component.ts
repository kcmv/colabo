// https://medium.com/@luukgruijs/validating-reactive-forms-with-default-and-custom-form-field-validators-in-angular-5586dc51c4ae
// https://blog.angular-university.io/introduction-to-angular-2-forms-template-driven-vs-model-driven/

import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Observable} from 'rxjs';
import { map, filter, startWith } from 'rxjs/operators';

import {RimaAAAService} from '../rima-aaa.service';
import {UserData} from '../userData';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';

@Component({
  selector: 'app-rima-register',
  templateUrl: './rima-register.component.html',
  styleUrls: ['./rima-register.component.css']
})
export class RimaRegisterComponent implements OnInit {

  public selectedCountry:String;
  form: FormGroup;

  firstName:FormControl = new FormControl("", [Validators.required, Validators.minLength(2)]); //an exmaple of defining a form control as independet

  constructor(
    fb: FormBuilder,
    private rimaAAAService: RimaAAAService
  ) {
      this.form = fb.group({
          // name: ['', [Validators.required,
          //   CustomValidators.validateCharacters //example of using custom validator imported from other service
          // ]],
          "email": ['', [Validators.required, Validators.email]],
          "firstName": this.firstName,
          "lastName":["", [Validators.required, Validators.minLength(2)]],
          "password":["", [Validators.required, Validators.minLength(3)]]
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

  get isRegistered(): Boolean {
    return this.rimaAAAService.isRegistered;
  }
  
  get isLoggedIn():Boolean{
    return this.rimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.rimaAAAService.getUser();
  }

  logOut(){
    this.rimaAAAService.logOut();
  }
  reset() {
    this.form.reset();
  }

  onSubmit( ){
    console.log("model-based form submitted");
    console.log(this.form);
    let userData:UserData = new UserData();
    userData.firstName = this.form.value.firstName;
    userData.lastName = this.form.value.lastName;
    userData.email = this.form.value.email;
    userData.password = this.form.value.password;
    this.rimaAAAService.createNewUser(userData, this.userCreated.bind(this));
  }

  userCreated():void{
    console.log('userCreated');
  }

  getWorldCountries():String[]{
    return [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan",
      "The Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso (formerly Upper Volta)", "Burundi",
      "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "People's Republic of China", "Republic of China (Taiwan)", "Cook Islands", "Colombia", "Comoros",
      "Democratic Republic of the Congo (formerly Zaire)", "Republic of the Congo", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Republic of Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Democratic Republic of Congo",
      "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
      "Fiji", "Finland", "France",
      "Gabon", "The Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
      "Haiti", "Holy See (see Vatican City)", "Honduras", "Hungary",
      "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast (see Côte d'Ivoire)",
      "Jamaica", "Japan", "Jordan",
      "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
      "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
      "Republic of Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Federated States of Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
      "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand (Aotearoa)", "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea", "Norway",
      "Oman",
      "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
      "Qatar",
      "Romania", "Russia", "Rwanda",
      "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
      "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria",
      "Taiwan (see Republic of China)", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
      "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
      "Vanuatu", "Vatican City (Holy See)",
      "Venezuela", "Vietnam",
      "Yemen",
      "Zambia", "Zimbabwe"
    ];
  }

}
