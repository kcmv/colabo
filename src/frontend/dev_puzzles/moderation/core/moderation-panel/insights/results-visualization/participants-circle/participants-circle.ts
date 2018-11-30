import { Component, OnInit } from '@angular/core';
import {InsightsService} from '../../insights.service';
// import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';

// import * as d3 from 'd3';
// import * as bb from 'billboard';
declare let d3:any;
declare let bb:any;
// import {bb} from 'billboard';

@Component({
  selector: 'participants-circle',
  templateUrl: './participants-circle.html',
  styleUrls: ['./participants-circle.css']
})
export class ParticipantsCircleComponent implements OnInit {

  // title = 'app';
  // color:string = 'blue';
  // radius = 10;
  
  constructor(
    private insightsService:InsightsService
  ) { }

  ngOnInit() {
    // this.generateTestChart();
  }

  // https://medium.com/@balramchavan/integrating-d3js-with-angular-5-0-848ed45a8e19
  ngAfterContentInit() {
    // d3 example: d3.select('p').style('color', this.color);
    // this.insightsService.getSDGSelections(true).subscribe(this.sDGSelectionsReceived.bind(this));
    this.insightsService.getRegisteredUsers(false).subscribe(this.usersReceived.bind(this));
  }

  private usersReceived(users:KNode[]):void{
    console.log('usersReceived',users.length);
    this.participantsCircle(users);
  }


  private createSvg(radius) {
    // d3.selectAll('svg').remove();
    var svg = d3.select('#participants-circle-canvas').append('svg:svg')
               .attr('width', (radius * 2) + 50)
               .attr('height', (radius * 2) + 50);
    return svg;
  }

  private createNodes(radius:number, users:KNode[]):any[] {
    let nodes:any[] = [], 
        width:number = (radius * 2) + 50,
        height:number = (radius * 2) + 50,
        angle:number,
        x:number,
        y:number,
        i:number;
    let numNodes:number = users.length;
    for (i=0; i<numNodes; i++) {
     angle = (i / (numNodes/2)) * Math.PI; // Calculate the angle at which the element will be placed.
                                           // For a semicircle, we would use (i / numNodes) * Math.PI.
     x = (radius * Math.cos(angle)) + (width/2); // Calculate the x position of the element.
     y = (radius * Math.sin(angle)) + (width/2); // Calculate the y position of the element.
     nodes.push({'id': i, 'x': x, 'y': y, 'user':users[i]});
    }
    return nodes;
  }

  private createElements(svg:any, nodes:any[], elementRadius:number, tooltip:any):void{
    let element = svg.selectAll('circle')
      .data(nodes)
      .enter().append('svg:circle')
        .attr('r', elementRadius)
        .attr('cx', function (d, i) {
          return d.x;
        })
        .attr('cy', function (d, i) {
          return d.y;
        })
        .on("mouseover", function(d, i) {	
          console.log('mouseover',tooltip, d3.event);	
          tooltip.transition()		
              .duration(200)		
              .style("opacity", .9);		
          tooltip.html((d.user as KNode).name)	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {
        console.log('mouseout');		
          tooltip.transition()		
              .duration(500)		
              .style("opacity", 0);	
      });
  }

  participantsCircle(users:KNode[]):void{
    let numNodes:number = users.length;
    let radius:number = 160;
    let elementRadius:number = 15;
    let nodes = this.createNodes(radius, users);
    let svg = this.createSvg(radius);

    // Define the div for the tooltip
    let tooltip = d3.select("#participants-circle-tooltip")
    .style("opacity", 0);
    //TODO: adding class not working for som reaso
    //let tooltip = d3.select("#participants-circle-canvas").append("div")	
    // .attr("class", "tooltip")				
    // .classed("tooltip", true)

    // .style("position", 'absolute');	
    // tooltip.html('tt-user')
    //   .style("left", "30px")		
    //   .style("top", "50px");	
    this.createElements(svg, nodes, elementRadius, tooltip);
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
