import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import {KMap} from '@colabo-knalledge/f-core/code/knalledge/kMap';
import {KnalledgeMapService} from '@colabo-knalledge/f-store_core/knalledge-map.service';
import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
// import {MatBottomSheet} from '@angular/material';
import {MapCreateForm} from './map-create/map-create-form';

@Component({
  selector: 'maps-list',
  templateUrl: './maps-list.component.html',
  styleUrls: ['./maps-list.component.css']
})
export class MapsListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MapCreateForm)
  private mapCreateForm:MapCreateForm;

  public modeCreating = false;
  public modeEditing = false;

  displayedColumns: string[] = ['id', 'name', 'creator', 'participants', 'publicity', 'actions'];
  mapsData:MatTableDataSource<KMap> = null;


  constructor(
    private knalledgeMapService:KnalledgeMapService,
    private rimaAAAService:RimaAAAService,
    // private bottomSheet: MatBottomSheet
  ) { }

  get mapsNo():number{
    return this.mapsData !== null ? this.mapsData.data.length : 0;
  }
  ngOnInit() {
    this.knalledgeMapService.getMaps().subscribe(this.mapsReceived.bind(this));
    if(this.mapsData !== null){
      this.setUpSourceData();
    }
  }

  protected setUpSourceData():void{
    this.mapsData.sort = this.sort;
    this.mapsData.paginator = this.paginator;
  }

  public applyFilter(filterValue: string) {
    let filterValuePrep = filterValue.trim().toLowerCase();
    // console.log('applyFilter',filterValuePrep);
    if(this.mapsData !== null){
      // console.log('[applyFilter] this.mapsData', this.mapsData);
      this.mapsData.filter = filterValuePrep;
    }
  }

  showMapCreateForm() {
    if (this.rimaAAAService.getUser()){
        console.log("[showMapCreateForm]");
        let mapToCreate = new KMap();
        mapToCreate.participants = [this.rimaAAAService.getUserId()];
        //this.mapToCreate.participants = this.rimaAAAService.getWhoAmI().displayName;
        this.modeCreating = true;
        this.mapCreateForm.show(null, this.mapCreateFormClosed.bind(this));
        
        // this.mapFormShow(this.mapToCreate);
        // this.bottomSheet.open(MapCreateForm);
    }else{
      window.alert("You must be logged in to create a map");
    }
  }

  public mapCreateFormClosed(map:KMap):void{
    this.modeCreating = false;
    if(map){
      this.mapsData.data.push(map);
      this.setUpSourceData();
    }
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
    this.setUpSourceData();
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
