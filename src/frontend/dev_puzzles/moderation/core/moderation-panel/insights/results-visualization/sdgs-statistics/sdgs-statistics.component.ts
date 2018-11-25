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
  }

  generateChart():void{
    console.log('this.sDGSelectedNo', this.sDGSelectedNo);
    let data:any[] = [];
    
    // for(var s:number = 0; s < InsightsService.SDGS_NO; s++){
    //   data.push([InsightsService.SDG_NAMES[s],this.sDGSelectedNo[s]]);
    // }

    data = this.sDGSelectedNo;
    data.unshift("SDGs Selection");

    console.log('data', data);

    var chart = bb.generate({
      bindto: "#chart",
      data: {
          type: "bar",
          columns: [
                // ["1 No Poverty", "Zero Hunger", "3", "4", "5. Education"],
                // data
                data
                // ["number of selections", {'No Poverty', 30},  200, 100, 170, 150, 250]
                // ["number of selections", this.sDGSelectedNo]
            ]
          // columns: [
          //     ["data1", 30,  200, 100, 170, 150, 250],
          //     ["data2", 130, 100, 140, 35,  110, 50 ]
          // ]
      }
    });
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
