import { Component, OnInit, Inject } from '@angular/core';

import {MatBottomSheetRef} from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';

export interface BottomShDgData{
    title:string,
    message?:string,
    btn1:string,
    btn2?:string, 
    callback?:Function
}

@Component({
    selector: 'bottom-sh-dg',
    templateUrl: './bottom-sh-dg.html',
    styleUrls: ['./bottom-sh-dg.css']
})
export class BottomShDg implements OnInit {

  protected callback:Function=null;


  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomShDg>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomShDgData,
  ) {
        this.callback = data.callback;
        // this.mdDialog.show();
        // this.mapFormActive = false;
        // setTimeout(() => this.mapFormActive = true, 0.1);
        // this.model = map;

        // this.bottomSheetRef.afterDismissed().subscribe(this.dissmissed.bind(this));
        
  }

  ngOnInit() {
  
  }


  close(btn:number):void {
    this.bottomSheetRef.dismiss();
    console.log('[BottomShDg] close',btn);
    if(this.data.callback){
      this.data.callback(btn);
    }
  }
}
