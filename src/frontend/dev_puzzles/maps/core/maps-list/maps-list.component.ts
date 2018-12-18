import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import {KMap} from '@colabo-knalledge/f-core/code/knalledge/kMap';
import {KnalledgeMapService} from '@colabo-knalledge/f-store_core/knalledge-map.service';

@Component({
  selector: 'maps-list',
  templateUrl: './maps-list.component.html',
  styleUrls: ['./maps-list.component.css']
})
export class MapsListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'creator', 'participants', 'publicity', 'actions'];
  mapsData:MatTableDataSource<KMap> = null;


  constructor(
    private knalledgeMapService:KnalledgeMapService
  ) { }

  get mapsNo():number{
    return this.mapsData !== null ? this.mapsData.data.length : 0;
  }
  ngOnInit() {
    this.knalledgeMapService.getMaps().subscribe(this.mapsReceived.bind(this));
    if(this.mapsData !== null){
      this.setUpMapData();
    }
  }

  protected setUpMapData():void{
    this.mapsData.sort = this.sort;
    this.mapsData.paginator = this.paginator;
  }

  private mapsReceived(maps:KMap[]):void{
    console.log('mapsReceived', maps);
    // let userInsights = [];
    // let usrId:string;
    // let map:KMap;
    // for(var i:number=0; i<maps.length; i++){
    //   map = maps[i];
    //   usrId = map._id;
    //   userInsights.push(new UserInsight(map, null, [], [], null, null, null));
    // }

    // console.log('mapsData:B',JSON.stringify(userInsights));
    
    this.mapsData = new MatTableDataSource(maps);
    // console.log('mapsData:A',JSON.stringify(this.mapsData));
    this.setUpMapData();
    // this.getCWCs();
    // this.getMyCFStates();
    // this.getCardsPlayed();
    // this.getSDGSelections();
  }

  getCreatorName(id:string):string{
    return id; //TODO:
  }

  printParticipants(participants:string[]):string{
    let result:string = participants.join(','); //TODO:
    let length:number = result.length;
    // console.log('participants.no:', participants.length);
    // console.log('participants:', result);
    // console.log('participants.length:', result.length);
    result = result.substr(0,70);
    if(result.length < length){ result+=' ...'}
    return result;
  }
}
