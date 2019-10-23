import { Component, OnInit } from '@angular/core';
import {InsightsService} from '../../insights.service';
// import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {ParticipantProfileComponent} from '../../participant-profile/participant-profile.component';
import { AfterViewInit, ViewChild } from '@angular/core';
import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {ParticipationType} from '../../participant-profile/participant-profile.component';

// import * as d3 from 'd3';
// import * as bb from 'billboard';
declare let d3:any;
declare let bb:any;
// import {bb} from 'billboard';

const Radius:number = 250;
const UserImgOverSize:number = 80;
const ParticipantOpacityStart:number = 0.6;

@Component({
  selector: 'participants-circle',
  templateUrl: './participants-circle.html',
  styleUrls: ['./participants-circle.css']
})
export class ParticipantsCircleComponent implements OnInit {
  public displayOptions:any = {
    type: ParticipationType.SDGS
  };

  nodes:any[] = [];
  tooltip:any;
  public selectedParticipant:KNode = null;

  @ViewChild(ParticipantProfileComponent)
  private participantProfile:ParticipantProfileComponent;

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

  setParticipantProfile(participant:KNode):void{
    this.selectedParticipant = participant;
    // this.participantProfile.visible = true;
  }

  clearParticipantProfile():void{
    this.selectedParticipant = null;
    // this.participantProfile.visible = false;
  }


  private createCanvas(radius:number):any {
    // d3.selectAll('svg').remove();
    var canvas:any = d3.select('#participants-circle-canvas');
    
    //TODO: not working - not stretching the parent DIV
    canvas
      .attr('width', (radius * 2) + 150 + 'px')
      .attr('height', (radius * 2) + 150 + 'px');
  
    return canvas;
  }

  // private checkImageExists(imageUrl:string, callBack:Function):void {
  //   var imageData = new Image();
  //   imageData.onload = function() {
  //     callBack(true);
  //   };
  //   imageData.onerror = function() {
  //     console.log('NON EXISTING IMG: '+imageUrl);
  //     // imageUrl = 'https://fv.colabo.space/assets/images/user_icons/performer.jpg';
  //     callBack(false);
  //   };
  //   imageData.src = imageUrl;
  // }

  isVisible():boolean{
    return this.participantProfile !==null && this.participantProfile.participantData !==null;
  }

  private createNodes(users:KNode[]):void {
    let that:ParticipantsCircleComponent = this;
    let width:number = (Radius * 2) + 50,
        height:number = (Radius * 2) + 50,
        angle:number,
        x:number,
        y:number,
        i:number;
    let numNodes:number = users.length;
    let imgLoadsLeft:number = numNodes;
    for (i=0; i<numNodes; i++) {
     angle = (i / (numNodes/2)) * Math.PI; // Calculate the angle at which the element will be placed.
                                           // For a semicircle, we would use (i / numNodes) * Math.PI.
     x = (Radius * Math.cos(angle)) + (width/2); // Calculate the x position of the element.
     y = (Radius * Math.sin(angle)) + (height/2); // Calculate the y position of the element.
     let dataContent = users[i].dataContent;
    RimaAAAService.userAvatar(users[i]).subscribe(
      function(avatar:string){
        dataContent.avatar = avatar;
        imgLoadsLeft--;
        if(imgLoadsLeft===0){
          that.nodesCreated();
        }
      }
    )
     dataContent.avatar = 'https://fv.colabo.space/assets/images/avatars/user.avatar-' + users[i]._id + '.jpg';
    //  this.checkImageExists(dataContent.avatar, 
    //   function(result:boolean){
    //     imgLoadsLeft--;
    //     if(!result){
    //       dataContent.avatar = 'https://fv.colabo.space/assets/images/user_icons/performer.jpg';
    //     }
    //     if(imgLoadsLeft===0){
    //       that.nodesCreated();
    //     }
    // });
     this.nodes.push({'id': i, 'x': x, 'y': y, 'user':users[i]});
    }
  }

  private createElements(canvas:any, elementRadius:number):void{
    let that:ParticipantsCircleComponent = this;
    console.log('[createElements] nodes', this.nodes);
    let element = canvas.selectAll('circle')
      .data(this.nodes)
      .enter()
        // .append('canvas:circle')
        // .attr('r', elementRadius)
        // .attr('cx', function (d, i) {
        //   return d.x;
        // })
        // .attr('cy', function (d, i) {
        //   return d.y;
        // })
        .append('img')
        .attr('src',  function(d) { return d.user.dataContent.avatar;})
        .attr("height", 50)
        .attr("width", 50)
        .style('left', function (d, i) {
          return d.x + 'px';
        })
        .style('top', function (d, i) {
          return d.y + 'px';
        })
        .style("position", 'fixed')

        element
        //class adding doesn't works:
        // .attr("class", 'user-img')
        // .classed("user-img", true)
        // so we add style by style:
        // .style('padding','3px')
        .style('border-radius','50%')
        .style('overflow','hidden')
        .style('border', 'solid darkgray 1px')

        .style("opacity", ParticipantOpacityStart)

        .on("mouseover", function (d,i) {that.participantOver(d, i, this);})	

        .on("mouseout", function (d,i) {that.participantOut(d, i, this);})	
  }

  participantOver(d, i, object:any):void {	
    console.log('mouseover', d3.event);	
    this.setParticipantProfile(d.user);
    d3.select( object )
    .raise() //putting it visually in front of the other participants
    .transition()
    .attr('left', d.x-30) //.attr('left', function(d) { return d.x-30;})
    .attr('top', d.y-30) //function(d) { return d.y-30;})
    .attr("height", UserImgOverSize)
    .attr("width", UserImgOverSize)
    .style("opacity", 1);	

    console.log('d3.event',d3.event);

    this.tooltip
      .transition()		
      .duration(200)		
      .style("opacity", 0.8);		
    this.tooltip.html((d.user as KNode).name)	
      .raise() //putting it visually in front of the other participants
      // .style("left", (d3.event.pageX) + "px")		
      // .style("left", (d3.event.target.x + d3.event.target.width + 3) + "px")		
      .style("left", (d3.event.target.x + UserImgOverSize + 3) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");	
  }

  participantOut(d, i, object:any):void {
    console.log('mouseout');		
    this.clearParticipantProfile();
    d3.select( object )
      .transition()
      // .attr('left', function(d) { return d.x;})
      .attr('left', d.x)
      .attr('top', d.y)
      .attr("height", 50)
      .attr("width", 50)
      .style("opacity", ParticipantOpacityStart);	
        
    this.tooltip.transition()		
      .duration(500)		
      .style("opacity", 0);	
  }

  participantsCircle(users:KNode[]):void{
    let numNodes:number = users.length;
    
    this.createNodes(users);
  }

  nodesCreated():void{
    let canvas = this.createCanvas(Radius);
    let elementRadius:number = 15;
    // Define the div for the tooltip
    this.tooltip = d3.select("#participants-circle-tooltip")
    .style("opacity", 0);
    //TODO: adding class not working for som reaso
    //let tooltip = d3.select("#participants-circle-canvas").append("div")	
    // .attr("class", "tooltip")				
    // .classed("tooltip", true)

    // .style("position", 'absolute');	
    // tooltip.html('tt-user')
    //   .style("left", "30px")		
    //   .style("top", "50px");	
    
    this.createElements(canvas, elementRadius);
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
