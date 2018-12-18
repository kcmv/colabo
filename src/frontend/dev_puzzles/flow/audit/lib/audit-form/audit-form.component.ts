import {MODULE_NAME} from '../params';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ColaboFlowAuditService } from '../colabo-flow-audit.service';

import { GetPuzzle, GetGeneral } from '@colabo-utils/i-config';
import { AuditedAction } from '@colabo-flow/i-audit';
import { Observable, of } from 'rxjs';

declare let d3:any;
declare let bb:any;

enum DisplaySet{
  ACTION_NAMES,
  STATISTICS
}

// https://www.npmjs.com/package/uuid
import * as uuidv1 from 'uuid/v1';

const ActionOpacityStart:number = 0.2;

@Component({
  selector: 'colabo-flow-audit-form',
  templateUrl: './audit-form.component.html',
  styleUrls: ['./audit-form.component.css']
})

export class ColaboFlowAuditForm implements OnInit {
  public sessionsFC:FormControl = new FormControl();
  public flowFC:FormControl = new FormControl();
  public selectedFlow:any = null;
  public selectedSessions:string[] = []; //[ "e123", "cat" , "e124"];//
  public items: AuditedAction[];
  public selectedDisplaySet:DisplaySet = DisplaySet.STATISTICS;
  // public sessions:string[] = [ "e123", "cat" , "e124"];
  private itemsPerName:string[][] = [];
  protected puzzleConfig: any;
  protected generalConfigBranding: any;
  protected actionStates:any = {};
  protected statistics:any[] = [];
  // protected columnMax:any[] = [];

  constructor(
    private colaboFlowAuditService: ColaboFlowAuditService,
  ) {
  }

  ngOnInit() {
    this.puzzleConfig = GetPuzzle(MODULE_NAME);
    this.selectedFlow = this.flowImages[1];
    this.generalConfigBranding = GetGeneral('branding');
    this.selectedSessions = this.sessions;
    // this.colaboFlowAuditService.getItems().subscribe(this.auditsReceived.bind(this));
  }

  ngAfterContentInit() {
    setTimeout(function(){
      this.drawActionsInteractions();
    }.bind(this), 1000);

    // d3 example: d3.select('p').style('color', this.color);
    this.colaboFlowAuditService.getActions(this.selectedSessions, this.selectedFlow.name).subscribe(this.auditsReceived.bind(this));
    this.colaboFlowAuditService.getStatistics(this.selectedSessions, this.selectedFlow.name).subscribe(this.statisticsReceived.bind(this));
  

    // switch(this.selectedDisplaySet){
    //   case DisplaySet.ACTION_NAMES:
    //     this.colaboFlowAuditService.getActions().subscribe(this.auditsReceived.bind(this));
    //     break;
    //   case DisplaySet.STATISTICS:
    //   default:
    //     this.colaboFlowAuditService.getStatistics(this.selectedSessions).subscribe(this.statisticsReceived.bind(this));
    //     break;
    // }

    //TEST:
    // this.doUpdate();
  }

  /*
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  myData = ['A', 'B', 'C', 'D', 'E'];
  no = 0;
  
  public doUpdate() {
    var rand = Math.floor( Math.random() * 26 );
    var myData = this.letters.slice(0, rand).split('');
    this.update(myData);
  }

  public doUpdate2() {
    var u = d3.select('#content')
	  .selectAll('div')
	  .data(this.myData);

    u.enter()
      .append('div');

    u.text(function(d) {
      return d;
    });
  }

  protected update(data) {
    let that:ColaboFlowAuditForm = this;
    ++this.no;
    var u = d3.select('#content')
      .selectAll('div')
      .data(data);

    u.enter()
      .append('div')
      .text(function(d) {
        return d;
      });

    u
      .text(function(d) {
        return d + that.no;
      });

    u.exit().remove();
  }
  */

  public sessionSelectionChanged():void{
    this.reloadStatistics();
    this.reloadActions();
  }

  public clearSessions():void{
    this.selectedSessions = [];
    this.reloadStatistics();
    this.reloadActions();
  }
  
  get subToolbarTitle():string{
    return this.generalConfigBranding.subToolbarTitle;
  }
  
  get flowImages(): any{
    return this.puzzleConfig.flowImages;
  }

  get sessions(): string[]{
    return this.puzzleConfig.sessions.sort();
  }

  protected get showActionNamesonFlow():boolean{
    return this.puzzleConfig.showActionNamesonFlow;
  }

  get logo(): string {
    return this.generalConfigBranding.logo;
  }

  public flowSelectionChanged():void {
    console.log('[flowSelectionChanged]');
    //TODO: add loading new flow-specific statistics etc:
    this.drawActionsInteractions();
  }

  setInitialActionStates(actions:any[], state:boolean=true):void{
    for(let actionKey in actions){
      this.actionStates[actions[actionKey].name] = state;
    }
    console.log('this.actionStates',this.actionStates);

    let that:ColaboFlowAuditForm = this;
    d3.selectAll("div.click-area")
      .style('background-color', function (d:any) { return that.isActionSelected(d.name) ? 'yellow' : 'gray'; })
  }

  drawActionsInteractions(){
    /*
    /TODO: iterating over multiple flowImages - option
    let flowImages = this.flowImages;
    for (let flowImageId in flowImages){
      let flowImage = flowImages[flowImageId];
      let clickArea = d3.select("#flow-diagram-" + this.selectedFlow.name).select("flow-click-areas");
    */
      let clickAreas = d3.select("#flow-diagram").select(".flow-click-areas");
      this.setInitialActionStates(this.selectedFlow.actions, true);
    this.drawActionsInteractionsForFlow(this.selectedFlow, clickAreas);
      
      //have to call it now AGAIN because 'drawActionsInteractions' is called from "ngAfterContentInit()" with 'setTimeout',
      //so ActionStates are not set yet when data is received:
      this.generateStatisticsGraphData();
    // }
  }

  noCh= 0;
  drawActionsInteractionsForFlow(flowImage, clickAreas) {
    this.noCh++;
    console.log('drawActionsInteractionsForFlow',this.noCh);
    let that:ColaboFlowAuditForm = this;
    // clickAreas.selectAll("div.action_zones").remove();
    let actionZones = clickAreas.selectAll("div.action_zone")//.action_zones")
      // .data(flowImage.actions, function (d) { 
      //   return d.name; // actions' names
      // });
      .data(flowImage.actions);
      
      actionZones.enter().append('div')
      .merge(actionZones) //to apply both on new (enter) and existing 
        .attr('class', 'action_zone click-area')
        .attr('id',function(d) { return d.name;})
        .style('position','absolute')
        .style('top', function (d) { return d.selectArea.y + "px"; })
        .style('left', function (d) { return d.selectArea.x + "px"; })
        .style('width', function (d) { return d.selectArea.width + "px"; })
        .style('height', function (d) { return d.selectArea.height + "px"; })
        // .attr('class', function (d) { return 'click-area'; })
        // .attr('class', function (d) { console.log(d.class); return d.class; })
        .style('border-radius','10px')
        .style('cursor', 'pointer')
        // .style('border', function (d) { return that.isActionSelected(d.name) ? 'black solid 2px' : 'none'; })
        .style('background-color', function (d) { return that.isActionSelected(d.name) ? 'yellow' : 'gray'; }) //'rgba(200, 200, 220)') //'rgba(200, 200, 220, 0.3)')
        .style('opacity', ActionOpacityStart)
        .html(function(d) {
          return that.showActionNamesonFlow ? (d.name + that.noCh) : '';
        })
        .on("mouseover", function (d,i) {that.actionOver(d, i, this);})	
        .on("mouseout", function (d,i) {that.actionOut(d, i, this);})
        .on("click", function (d,i) {that.actionClick(d, i, this);})
        // .append('<div><i class="material-icons">visibility</i></div>')
      
      actionZones.exit()
        .html(function(d) { // not invited?! maybe not possible on .exit() ?!
          return that.showActionNamesonFlow ? ('removed') : '';
        })
        .remove();
  }

  isActionSelected(name:string):boolean{
    return (name in this.actionStates) && this.actionStates[name];
  }

  actionOver(d, i, object:any):void {	
    // console.log('mouseover', d3.event);	
    // this.setactionProfile(d.user);
    d3.select( object )
      // .raise() //putting it visually in front of the other actions
      .transition()
      // .attr('left', d.x-30) //.attr('left', function(d) { return d.x-30;})
      // .attr('top', d.y-30) //function(d) { return d.y-30;})
      // .attr("height", UserImgOverSize)
      // .attr("width", UserImgOverSize)
      .style("opacity", 0.6);	

    // console.log('d3.event',d3.event);

    /*
    this.tooltip
      .transition()		
      .duration(200)		
      .style("opacity", 0.8);		
    this.tooltip.html((d.user as KNode).name)	
      .raise() //putting it visually in front of the other actions
      // .style("left", (d3.event.pageX) + "px")		
      // .style("left", (d3.event.target.x + d3.event.target.width + 3) + "px")		
      .style("left", (d3.event.target.x + UserImgOverSize + 3) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");	
      */
  }

  actionOut(d, i, object:any):void {
    // console.log('mouseout');		
    // this.clearactionProfile();
    d3.select( object )
      .transition()
      // .attr('left', function(d) { return d.x;})
      // .attr('left', d.x)
      // .attr('top', d.y)
      // .attr("height", 50)
      // .attr("width", 50)
      .style("opacity", ActionOpacityStart);	
      
    /*
    this.tooltip.transition()		
      .duration(500)		
      .style("opacity", 0);	
    */
  }

  actionClick(d, i, object:any):void {
    console.log('actionClick',d.name);		
    if(d.name in this.actionStates){
      this.actionStates[d.name] = !this.actionStates[d.name];
    }
    // this.clearactionProfile();
    d3.select( object )
      .style('background-color', this.isActionSelected(d.name) ? 'yellow' : 'gray')
      // .transition()
      // .attr('left', function(d) { return d.x;})
      // .attr('left', d.x)
      // .attr('top', d.y)
      // .attr("height", 50)
      // .attr("width", 50)
      // .style("opacity", ActionOpacityStart)
      ;	
    this.generateStatisticsGraphData();
      
    /*
    this.tooltip.transition()		
      .duration(500)		
      .style("opacity", 0);	
    */
  }
  
  // flowAreaClicked():void{
  //   console.log('flowAreaClicked');
  // }
  
  reloadActions(){
    //test: this.selectedSessions.shift();
    // console.log('[reloadActions] this.selectedSessions', this.selectedSessions);
    this.colaboFlowAuditService.getActions(this.selectedSessions, this.selectedFlow.name).subscribe(this.auditsReceived.bind(this));
  }
  
  reloadStatistics(){
    console.log('[reloadStatistics] this.selectedSessions', this.selectedSessions);
    this.colaboFlowAuditService.getStatistics(this.selectedSessions, this.selectedFlow.name).subscribe(this.statisticsReceived.bind(this));
  }

  setAllActions(value:boolean):void{
    //option for iterating all the flows
    // for (let flowImageId in this.flowImages){
    //   let flowImage = this.flowImages[flowImageId];
    //   this.setInitialActionStates(flowImage.actions, value);
    // }

    this.setInitialActionStates(this.selectedFlow.actions, value);
    this.generateStatisticsGraphData();
  }

  displaySetKeys():string[]{
    return Object.keys(DisplaySet).filter(key => isNaN(Number(key)));
  }

  displaySetValues():string[]{
    // not working: Object.values(DisplaySet) 
    return Object.keys(DisplaySet).map(key => DisplaySet[key]);
  }

  statisticsReceived(statistics:any[]):void{
    this.statistics = statistics;
    this.generateStatisticsGraphData();
  }

  scaleStatistics(columns:any[][]):any[][]{
    console.log('scaleStatistics',columns);
    let scaledColumns:any[][] = JSON.parse(JSON.stringify(columns));
    let maxPerColumn:number = NaN;
    let minPerColumn:number = NaN;
    let column:any[];
    for(var c:number = 0; c<columns.length; c++){
      maxPerColumn = NaN;
      minPerColumn = NaN;
      column = columns[c];

      //finding max/min:
      for(var v:number = 1; v<column.length; v++){ //we are skipping column[0], because it is the column name (according to Billboard.js columns syntax)
        if(Number.isNaN(maxPerColumn) || column[v]>maxPerColumn){maxPerColumn = column[v];} 
        if(Number.isNaN(minPerColumn) || column[v]<minPerColumn){minPerColumn = column[v];} 
      }

      // this.columnMax[c] = {'max':maxPerColumn, 'min':minPerColumn};

      //scaling:
      for(var v:number = 1; v<column.length; v++){ //we are skipping column[0], because it is the column name (according to Billboard.js columns syntax)
        column[v] = column[v] / maxPerColumn;
      }
    }
    return scaledColumns;
  }

  generateStatisticsGraphData(){
    console.log('[generateStatisticsGraphData] statistics',this.statistics);
    let categories:string[] = [];
    // let categories:string[] = Object.keys(this.statistics).filter(catetory => this.isActionSelected(catetory));
    // console.log('[statisticsReceived] categories', categories);

    let columnsObj:any = {};
    let statForAct:any;
    for(let i:number = 0; i < this.statistics.length; i++){
      statForAct = this.statistics[i];
      if(this.isActionSelected(statForAct.name)){
        categories.push(statForAct.name);
        let stats:any = statForAct.stats;
        for(let stat in stats){
          if(!(stat in columnsObj)){columnsObj[stat]=[];}
          columnsObj[stat].push(stats[stat]);
        }
      }
    }
    console.log('[statisticsReceived] columnsObj', columnsObj);

    let columns:any[][] = [];
    for(let column in columnsObj)
    {
      columnsObj[column].unshift(column);
      columns.push(columnsObj[column]);
    }

    console.log('[statisticsReceived] columns', columns);
    let scaledColumns:any[][] = this.scaleStatistics(columns);
    this.generateStatisticsChart(columns, scaledColumns, categories);
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

    this.generateAuditsChart();
  }

  generateStatisticsChart(columns:any[][], columnsUnscaled:any[][], categories:string[]=null):void{
    // let that:ColaboFlowAuditForm = this;
    let columnsByColName:any = {};
    
    //transforming billboard.js format of array of columns (with first element being columns name) into
    //an object with properties equal to array of column values and property-name equal to columnn-name
    //to be used in printing the unscaled data-label
    let colName:string;
    for(var c:number = 0; c<columnsUnscaled.length; c++){
      colName = columnsUnscaled[c][0];
      columnsUnscaled[c].shift(); //removing the column-name
      columnsByColName[colName] = columnsUnscaled[c];
    }
    
    console.log('[generateStatisticsChart] columns', columns, 'columnsUnscaled', columnsUnscaled);
    
    var chart = bb.generate({
      bindto: "#chart_statistics",
      "title": {
        "text": "Distribution of Audits"
      },
      "transition": {
          "duration": 2000
      },
      data: {
          type: "bar",
          columns: columns,
          labels: {
            /**
             * @param v - valuse
             * @param id - column-name
             * @param i - index in the column
             * @param j - ??
             */
            format: function (v, id, i, j) {
                let value:number=v;
                // console.log('format','v',v,'id',id,'i',i,'j',j);
                if(id !== undefined && i !== undefined){
                  value = columnsByColName[id][i];
                }
                return value;//d3.format(",.2%")(v) + data[0][i + 1];
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
          categories: categories
        },
        y: {
          label: {
            text: "Number of Audits",
            position: "inner-middle"
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
        hide: false
      }
    });
  }

  generateAuditsChart():void{
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
      bindto: "#chart_audits",
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
            text: "Number of Audits",
            position: "inner-middle"
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
    //   y: "Numbrer of actions selecting it"
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
