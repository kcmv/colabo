import {MODULE_NAME} from '../params';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ColaboFlowAuditService } from '../colabo-flow-audit.service';

import { GetPuzzle } from '@colabo-utils/i-config';
import { AuditedAction } from '@colabo-flow/i-audit';
import { Observable, of } from 'rxjs';

declare let d3:any;
declare let bb:any;


// https://www.npmjs.com/package/uuid
import * as uuidv1 from 'uuid/v1';

@Component({
  selector: 'colabo-flow-audit-form',
  templateUrl: './audit-form.component.html',
  styleUrls: ['./audit-form.component.css']
})

export class ColaboFlowAuditForm implements OnInit {
  public items: AuditedAction[];
  private itemsPerName:string[][] = [];
  protected puzzleConfig: any;

  constructor(
    private colaboFlowAuditService: ColaboFlowAuditService,
  ) {
  }

  ngOnInit() {
    this.puzzleConfig = GetPuzzle(MODULE_NAME);
    // this.colaboFlowAuditService.getItems().subscribe(this.auditsReceived.bind(this));
  }

  ngAfterContentInit() {
    // d3 example: d3.select('p').style('color', this.color);
    this.colaboFlowAuditService.getItems().subscribe(this.auditsReceived.bind(this));
  }

  auditsReceived(audits:AuditedAction[]):void{
    this.itemsPerName = [];
    this.items = audits;
    let name:string;
    for(var a:number=0;a<audits.length;a++)
    {
      name = audits[a].name;
      if(!(name in this.itemsPerName)){
        this.itemsPerName[name] = 1;
      }else{
        this.itemsPerName[name]++;
      }
    }
    console.log('itemsPerName',this.itemsPerName);

    this.generateChart();
  }

  generateChart():void{
    let keys:string[] = [];
    let data:any[] = ['audits per name'];
    for(var k in this.itemsPerName){
      keys.push(k);
      data.push(this.itemsPerName[k]);
    }
    // let data = this.itemsPerName.slice(); //hard copy
    // console.log('this.itemsPerName.keys',this.itemsPerName.keys);
    // data.unshift("Times chosen"); //data name
    console.log('data', data);
    
    var chart = bb.generate({
      bindto: "#chart",
      "title": {
        "text": "Distribution of Audits per name"
      },
      "transition": {
          "duration": 2000
      },
      data: {
          type: "bar",
          columns: [data],
          labels: {
            format: function (v, id, i, j) {
                return v;//d3.format(",.2%")(v) + data[0][i + 1];
            }
        }
      },
      axis: {
        x: {
          label: {
            text: "",//: it overlaps visually with categories: "17 SDGs",
            position: "outer-center"
          },
          type: "category",
          categories: keys
        },
        y: {
          label: {
            text: "Number of Audits with specific name",
            position: "inner-top "
          }
          // ,
          // labels: {
          //   format: function (v, id, i, j) {
          //       return d3.format(",.2%")(v) + data[0][i + 1];
          //   }
          // }
        }
      },
      legend:{
        hide: true
      }
    });
    
    // chart.legend.inset.y = 20;

    // chart.axis.labels({
    //   x: "17 SDGs",
    //   y: "Numbrer of participants selecting it"
    // });

    // chart.categories(InsightsService.SDG_NAMES);
    // chart.data.names(InsightsService.SDG_NAMES);
    // chart.axis.x.categories = InsightsService.SDGS_NO;

    // chart.axis: {
    //   x: {
    //     categories: InsightsService.SDGS_NO
    //   }
    // }

    /* GRID DATA : NOT USING NOW
    let xgridsData:any[] = [];
    // [
    //   {value: 1, text: "Label 1"},
    //   {value: 4, text: "Label 4"}
    // ]
    for(var s:number = 0; s < InsightsService.SDGS_NO; s++){
      xgridsData.push({value:s, text:InsightsService.SDG_NAMES[s]});
    }
    chart.xgrids(xgridsData);
    */

  //  chart.xgrids.add([
  //     {value: 2, text: "Label 2"},
  //     {value: 5, text: "Label 4"}
  //   ]);
  }

}
