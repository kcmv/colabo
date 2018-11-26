import { Component, OnInit } from '@angular/core';
import {InsightsService} from '../../insights.service';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';

// import * as d3 from 'd3';
// import * as bb from 'billboard';
declare let d3:any;
declare let bb:any;
// import {bb} from 'billboard';

@Component({
  selector: 'sdgs-statistics',
  templateUrl: './sdgs-statistics.component.html',
  styleUrls: ['./sdgs-statistics.component.css']
})
export class SdgsStatisticsComponent implements OnInit {

  // title = 'app';
  // color:string = 'blue';
  // radius = 10;
  private sDGSelectedNo:number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 

  constructor(
    private insightsService:InsightsService
  ) { }

  ngOnInit() {
    this.generateTestChart();
  }

  // https://medium.com/@balramchavan/integrating-d3js-with-angular-5-0-848ed45a8e19
  ngAfterContentInit() {
    // d3 example: d3.select('p').style('color', this.color);
    this.insightsService.getSDGSelections(true).subscribe(this.sDGSelectionsReceived.bind(this));
  }

  sDGSelectionsReceived(sdgs:KEdge[]):void{
    console.log('sDGSelectionsReceived',sdgs);
    // for(var sd:number = 0; sd < sdgs.length; sd++){
    for(var s:number = 0; s < sdgs.length; s++){
       this.sDGSelectedNo[ ((sdgs[s].targetId as any).dataContent.humanID as number)-1]++; //TODO: expects the current situation in which humanIDs of SDGs are equal SDG Number.
    }
    this.generateChart();
    this.generatePieChart();
  }

  generateTestChart():void{
    // this.generateTestChart1();
  //   this.generateTestChart2();
  }

  // generateTestChart1():void{
  //   var data = [ 
  //     ["data1", 0.1, 0.3, 0.2, 0.4, 0.5]
  //   ];
    
  //   var chart = bb.generate({
  //       bindto: "#test_chart",
  //       data: {
  //         type: "bar",
  //         columns: data,
  //         labels: {
  //             format: function (v, id, i, j) {
  //                 return d3.format(",.2%")(v);
  //             }
  //         }
  //       }
  //   });
  // }

  // generateTestChart2():void{
  //   var chart = bb.generate({
  //     bindto: "#test_chart",
  //     data: {
  //         type: "bar",
  //         columns: [
  //               // ["1 No Poverty", "Zero Hunger", "3", "4", "5. Education"],
  //               // data
  //               ['data1', 12,14,40,5]
  //               // ["number of selections", {'No Poverty', 30},  200, 100, 170, 150, 250]
  //               // ["number of selections", this.sDGSelectedNo]
  //           ]
  //         // columns: [
  //         //     ["data1", 30,  200, 100, 170, 150, 250],
  //         //     ["data2", 130, 100, 140, 35,  110, 50 ]
  //         // ]
  //     },
  //     axis: {
  //       x: {
  //         label: {
  //           text: "17 SDGs",
  //           position: "outer-center"
  //         },
  //         type: "category",
  //         categories: InsightsService.SDG_NAMES
  //       }
  //     }
  //   });

  //   // chart.axis.labels({
  //   //   x: "17 SDGs",
  //   //   y: "Numbrer of participants selecting it"
  //   // });

  //   // chart.categories(InsightsService.SDG_NAMES);
  //   // chart.data.names(InsightsService.SDG_NAMES);
  //   // chart.axis.x.categories = InsightsService.SDGS_NO;

  //   // chart.axis: {
  //   //   x: {
  //   //     categories: InsightsService.SDGS_NO
  //   //   }
  //   // }

  //   let xgridsData:any[] = [];
  //   // [
  //   //   {value: 1, text: "Label 1"},
  //   //   {value: 4, text: "Label 4"}
  //   // ]
  //   for(var s:number = 0; s < InsightsService.SDGS_NO; s++){
  //     xgridsData.push({value:s, text:InsightsService.SDG_NAMES[s]});
  //   }
  //   chart.xgrids(xgridsData);


  // //  chart.xgrids.add([
  // //     {value: 2, text: "Label 2"},
  // //     {value: 5, text: "Label 4"}
  // //   ]);
  // }

  generateChart():void{
    console.log('this.sDGSelectedNo', this.sDGSelectedNo);
    let data:any[] = [];
    
    // for(var s:number = 0; s < InsightsService.SDGS_NO; s++){
    //   data.push([InsightsService.SDG_NAMES[s],this.sDGSelectedNo[s]]);
    // }

    data = this.sDGSelectedNo.slice(); //hard copy
    data.unshift("Times chosen"); //data name

    console.log('data', data);

    var chart = bb.generate({
      bindto: "#chart",
      "title": {
        "text": "Distribution of SDGs Selections"
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
          categories: InsightsService.SDG_NAMES
        },
        y: {
          label: {
            text: "Numbrer of participants selecting it",
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

  generatePieChart():void{
    let columnData:any[] = [];
    for(var s:number = 0; s < InsightsService.SDGS_NO; s++){
      columnData.push([InsightsService.SDG_NAMES[s],this.sDGSelectedNo[s]]);
    }
    // columnData = [
    //   [InsightsService.SDG_NAMES[0], this.sDGSelectedNo[0]],
    //   [InsightsService.SDG_NAMES[1], this.sDGSelectedNo[1]]
    // ];

  var chart = bb.generate({
    data: {
      columns: columnData,
      type: "pie"
    //, onclick: function(d, i) {
    // console.log("onclick", d, i);
    //  },
    //   onover: function(d, i) {
    // console.log("onover", d, i);
    //  },
    //   onout: function(d, i) {
    // console.log("onout", d, i);
    //  }
    },
    bindto: "#PieChart"
  });
  
  // chart.resize({height: 600, width: 600})
}
  

  /* D3 example invoked by template's click
  clicked(event: any) {
    d3.select(event.target).append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', () => {
        return this.radius;
      })
      .attr('fill', this.color);
  }

  */

}
