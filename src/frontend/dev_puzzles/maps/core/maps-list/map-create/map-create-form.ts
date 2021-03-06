import { Component, OnInit, Inject } from "@angular/core";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, filter, startWith } from "rxjs/operators";

import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { KnalledgeMapService } from "@colabo-knalledge/f-store_core";
import { MatSnackBar } from "@angular/material";
import { ServerError, KMapErrors } from "@colabo-knalledge/f-store_core";

// import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';
import { KMap } from "@colabo-knalledge/f-core/code/knalledge/kMap";

// import {NgForm} from '@angular/forms';
// import {Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatBottomSheetRef } from "@angular/material";
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material";

export interface MapCreateFormData {
  map: KMap;
  callback: Function;
}

@Component({
  selector: "map-create-form",
  templateUrl: "./map-create-form.html",
  styleUrls: ["./map-create-form.css"]
})
export class MapCreateForm implements OnInit {
  //   public selectedCountry:String;
  // public mapTemplate: any;
  form: FormGroup;
  protected callback: Function = null;
  public submitted: boolean = false;

  //an exmaple of defining a form control as independet
  //   firstName:FormControl = new FormControl("", [Validators.required, Validators.minLength(2)]);

  constructor(
    private fb: FormBuilder,
    private knalledgeMapService: KnalledgeMapService,
    private rimaAAAService: RimaAAAService,
    private bottomSheetRef: MatBottomSheetRef<MapCreateForm>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: MapCreateFormData,
    public snackBar: MatSnackBar
  ) {
    this.callback = data.callback;
    // this.mdDialog.show();
    // this.mapFormActive = false;
    // setTimeout(() => this.mapFormActive = true, 0.1);
    // this.model = map;

    this.bottomSheetRef.afterDismissed().subscribe(this.dissmissed.bind(this));
  }

  ngOnInit() {
    this.submitted = false;
    this.form = this.fb.group({
      // name: ['', [Validators.required,
      //   CustomValidators.validateCharacters //example of using custom validator imported from other service
      // ]],
      //   "email": ['', [Validators.required, Validators.email]],
      name: ["", [Validators.required, Validators.minLength(2)]],
      isPublic: [false],
      // 'countryControl': [this.countries[1].id],
      mapTemplate: [this.mapTemplates[0].id],
      desc: [this.mapTemplates[0].desc],
      id: [""]
      //   "password":["", [Validators.required, Validators.minLength(3)]]
    });

    this.form.valueChanges
      // example .map((value) => {
      //     value.firstName = value.firstName.toUpperCase();
      //     return value;
      // })
      .pipe(filter(value => this.form.valid))
      .subscribe(value => {
        console.log(
          "Model Driven Form valid value: vm = ",
          JSON.stringify(value)
        );
      });
  }

  labelPublic(): string {
    return this.form.value.isPublic
      ? "public Map"
      : "private Map <mat-icon>lock</mat-icon>";
  }

  isPublic(): boolean {
    return this.form.value.isPublic;
  }

  get creatBtnTitle(): string {
    return this.submitted ? "Creating ..." : "Create";
  }

  // countries = ['USA', 'Canada', 'Uk']

  mapTemplates = [
    {
      id: "plain-map",
      name: "Plain Map",
      desc: "Plain Map"
    },
    {
      id: "sust-dev",
      name: "Sustainable Development Colabo",
      desc: "Welcome to the Collaboration on Sustainable Development"
    },
    {
      id: "co-writing",
      name: "Collective Creative Writing",
      desc: "Welcome to the Collective Creative Writing"
    }
  ];

  /*
  using the Getter caused blocking of the page (overrunning the processor)
  get mapTemplatesOld():any[]{
    return [
      {
        id:'plain-map',
        name:'Plain Map'
      },
      {
        id:'co-writing',
        name:'Collective Creative Writing'
      }
    ]
  }
  */

  // templateChanged():void{

  // }

  public getDesc(): string {
    if (this.form.value.mapTemplate) {
      let mapT = this.mapTemplates.find(mapTemp => {
        return mapTemp.id === this.form.value.mapTemplate;
      });
      return mapT.desc;
    } else {
      return "";
    }
  }

  dissmissed(): void {
    //   console.log('[MapCreateForm] dissmissed');
  }

  reset(): void {
    this.form.reset();
  }

  cancel(): void {
    this.finish(null);
  }

  finish(result: KMap): void {
    this.form.reset(); //cleaning the form for the next use
    this.bottomSheetRef.dismiss();
    if (this.callback) {
      this.callback(result);
    }
    // this.submitted = false;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("model-based form submitted");
      console.log(this.form);
      this.submitted = true;
      let map: KMap = new KMap();
      if (this.form.value.name !== "") {
        map._id = this.form.value.name;
      }
      map.name = this.form.value.name;
      map.isPublic = this.form.value.isPublic;
      map.iAmId = this.rimaAAAService.getUserId();
      map.type = this.form.value.mapTemplate;
      map.dataContent = { property: this.form.value.desc };

      this.knalledgeMapService
        .create(map)
        .subscribe(
          this.mapCreated.bind(this),
          this.mapCreationError.bind(this)
        );
    } else {
      this.snackBar.open("The form is not valid", "Check your inputs", {
        duration: 2000
      });
      console.warn("cannot submit! The form is not valid");
    }
  }
  mapCreationError(error: ServerError): void {
    console.error("[MapCreateForm::mapCreationError]", error.message);
    let msg: string;
    switch (error.code) {
      case KMapErrors.TEMPLATE_LOADING:
        msg = "The selected template could not be loaded";
        break;
        case KMapErrors.MAP_SAVING:
            msg = "The map could not be saved";
            break;
      default:
      case KMapErrors.MAP_CREATE:
        msg = "The map could not be created";
        break;
    }
    this.snackBar.open("Map Creation Failed", msg, {
      duration: 4000
    });
  }

  mapCreated(map: KMap): void {
    if (!map) {
      console.error("[MapCreateForm] error in creation");
      //TODO: see if we want to show notification here, or handle it by 'callback'
      this.snackBar.open("Map Creation Failed", "Try Again", {
        duration: 2000
      });
    } else {
      this.snackBar.open("Map Created", "OK", {
        duration: 2000
      });
      this.finish(map);
    }
  }

  // myControl = new FormControl();
  // public mapFormActive = true;
  // model = new KMap();

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

    close(confirm:boolean):void{
        console.log("[MapFormComponent].close:",confirm);
        // this.mdDialog.close();
        if(this.callback){
        this.callback(false);
        }
    }
    */

  /*
  show(map:KMap=null, callback:Function=null):void{
    console.log("[MapFormComponent].show");
    this.callback = callback;
    // this.mdDialog.show();
    // this.mapFormActive = false;
    // setTimeout(() => this.mapFormActive = true, 0.1);
    // this.model = map;
  }*/

  // fullUpdate() {
  //   this.form.setValue({firstName: 'Partial', password: 'monkey'});
  // }
  //
  // partialUpdate() {
  //     this.form.patchValue({firstName: 'Partial'});
  // }
}
