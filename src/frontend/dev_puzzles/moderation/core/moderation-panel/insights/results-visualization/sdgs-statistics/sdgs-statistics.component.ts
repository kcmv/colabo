import { Component, OnInit } from '@angular/core';

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

  title = 'app';
  color:string = 'blue';

  radius = 10;

  constructor() { }

  ngOnInit() {
  }

  // https://medium.com/@balramchavan/integrating-d3js-with-angular-5-0-848ed45a8e19
  ngAfterContentInit() {
    d3.select('p').style('color', this.color);
    this.generateChart();
  }

  generateChart():void{
    var chart = bb.generate({
      bindto: "#chart",
      data: {
          type: "bar",
          columns: [
              ["data1", 30, 200, 100, 170, 150, 250],
              ["data2", 130, 100, 140, 35, 110, 50]
          ]
      }
    });
  }

  clicked(event: any) {
    d3.select(event.target).append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', () => {
        return this.radius;
      })
      .attr('fill', this.color);
  }

}
