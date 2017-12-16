import {NgClass, NgStyle} from '@angular/common';

import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload/ng2-file-upload';

import {NgForm} from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

import {Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";

declare var knalledge;

const URL = 'http://localhost:8001/mapImport.json';//'http://localhost:3000/mapImport'; //'kmaps.json:8001';

@Component({
  selector: 'import-map-form',
  moduleId: module.id,
  templateUrl: 'partials/import-map-form.component.tpl.html',
  providers: [
      // MATERIAL_PROVIDERS,
  ],
})
export class ImportMapFormComponent {
  public importMapFormActive = true;
  public giveNewName:boolean = false;
  public mapName:string = "";
  model = new knalledge.KMap();

  public uploader:FileUploader = new FileUploader({url: URL});

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;


  private creatingFunction:Function=null;

  @ViewChild(MdDialog) private mdDialog:MdDialog;

  onSubmit() {
    console.log('[onSubmit]');
    this.mdDialog.close();
    if(this.creatingFunction){
      this.creatingFunction(true);
    }
  }

  // get debugging(){
  //   return
  // }
  //

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  show(creatingFunction:Function){
    console.log("[ImportMapFormComponent].show");
    this.creatingFunction = creatingFunction;
    this.mdDialog.show();
    this.importMapFormActive = false;
    setTimeout(() => this.importMapFormActive = true, 0.1);
    //this.model = map;
  }

  close(confirm){
    console.log("[ImportMapFormComponent].close:",confirm);
    this.mdDialog.close();
    if(this.creatingFunction){
      this.creatingFunction(false);
    }
  }

  giveNewNameChanged(event){
    if(!event){
      this.mapName = "";
    }
  }
}

//using https://github.com/valor-software/ng2-file-upload
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from '@angular/material';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2MaterialModule} from 'ng2-material';

var moduleImports = [];
moduleImports.push(BrowserModule);
moduleImports.push(FormsModule);
moduleImports.push(MaterialModule);
moduleImports.push(Ng2MaterialModule);

var componentDirectives = [
  FILE_UPLOAD_DIRECTIVES,
  ImportMapFormComponent
];

export let importMapFormComponentExportDirectives = [];
for (let i=0; i<componentDirectives.length; i++){
  importMapFormComponentExportDirectives.push(componentDirectives[i]);
}

// for (let i=0; i<bottomPanelComponentDirectives.length; i++){
//   importMapFormComponentExportDirectives.push(bottomPanelComponentDirectives[i]);
// }

// @NgModule for tools
@NgModule({
  imports: moduleImports,
  exports: importMapFormComponentExportDirectives,
  declarations: componentDirectives
})
export class ImportMapFormModule {}
