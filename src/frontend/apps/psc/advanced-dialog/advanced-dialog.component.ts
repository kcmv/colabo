import { Component, ReflectiveInjector, Injector, Inject, Optional, NgModule, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {MaterialModule} from '../materialModule';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material';

// https://material.angular.io/components/dialog/api
// https://github.com/angular/material2/blob/master/src/demo-app/dialog/dialog-demo.ts
// https://stackoverflow.com/questions/43031132/how-to-add-input-to-dialog-component-in-angular-2-material
// https://stackoverflow.com/questions/41745944/execute-particular-component-after-click-on-md-dialog-button
@Component({
  selector: 'advanced-dialog',
  templateUrl: 'advanced-dialog.component.tpl.html',
  styleUrls: ['advanced-dialog.component.scss']

})
export class AdvancedDialog {

  constructor(
    public dialogRef: MatDialogRef<AdvancedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data.registerShowCallback){
        data.registerShowCallback(function(){
          this.showHistogram(data.statistics);
        }.bind(this))
      }
  }

  // http://bl.ocks.org/nnattawat/8916402
  showHistogram(dataset){
  }
}
