import { Component, ReflectiveInjector, Injector, Inject, Optional, NgModule, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {MaterialModule} from '../materialModule';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material';

// import {AdvancedDialog} from './advanced-dialog.component';
var moduleImports = [];
var componentDirectives = [];

@Component({
  selector: 'snack-bar-component-notification',
  templateUrl: 'snack-bar-component-notification.html',
  styles: [`.notification { color: red; }`],
})
export class NotificationComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: any) { }
}

@NgModule({
  imports: moduleImports,
  declarations: componentDirectives
})

@Component({
  selector: 'advanced-dialog-test',
  templateUrl: './advanced-dialog-test.component.tpl.html',
  styleUrls: ['./advanced-dialog-test.component.scss']
})

export class AdvancedDialogTest implements OnInit, AfterViewInit, OnDestroy{
  public title: string = 'AdvancedDialogTest';

  constructor(
    public dialog: MatDialog,
    public snackBar:MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
  }

  getInitialParams() {
      const search = this.activatedRoute.snapshot.paramMap.get('search');
      console.log("[KnalledgeViewComponent] search: ", search);
  }

  ngOnInit() {
    this.getInitialParams();
    this.openSnackBar("Gender:Undefined context selected");
  }

  openSnackBar(msg){
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 1500,
      data: msg
    });
  }

  ngAfterViewInit(){
    this.initContent();
  }

  ngOnDestroy() {
  }

  initContent(){

  }

  showStats(vkNode, genderSelected){
    var showCallback = null;
    let statistics = [];
    // let dialogRef = this.dialog.open(AdvancedDialog, {
    //   width: '800px',
    //   data: {
    //     title: "Statistics",
    //     message: "For attribute: "+name + ", filter: "+ genderSelected,
    //     // + ", statistics: " + JSON.stringify(statistics),
    //     statistics: statistics,
    //     registerShowCallback: function(callback){
    //       showCallback = callback;
    //     }
    //   }
    // });

    // dialogRef.afterOpen().subscribe(result => {
    //   console.log('The dialog is now opened');
    //   if(showCallback) showCallback();
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

}
