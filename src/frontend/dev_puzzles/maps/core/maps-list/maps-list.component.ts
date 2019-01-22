import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import {KMap} from '@colabo-knalledge/f-core/code/knalledge/kMap';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KnalledgeMapService} from '@colabo-knalledge/f-store_core/knalledge-map.service';
import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {MapCreateForm, MapCreateFormData} from './map-create/map-create-form';
import {BottomShDgData, BottomShDg} from './bottom-sh-dg/bottom-sh-dg';
import { Router } from '@angular/router';

import {MatSnackBar} from '@angular/material';
import { Observable, of } from 'rxjs';
import { //catchError, map, 
  tap } from 'rxjs/operators';

@Component({
  selector: 'maps-list',
  templateUrl: './maps-list.component.html',
  styleUrls: ['./maps-list.component.css']
})
export class MapsListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild(MapCreateForm)
  // private mapCreateForm:MapCreateForm;

  public modeCreating = false;
  public modeEditing = false;
  protected creators:any = {};

  displayedColumns: string[] = [];
  mapsData:MatTableDataSource<KMap> = null;


  constructor(
    private knalledgeMapService:KnalledgeMapService,
    private rimaAAAService:RimaAAAService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private router: Router
  ) { 
    this.displayedColumns = [ 'name', 'type', 'creator', 'created', 'actions']; //'participants',
    if(this.rimaAAAService.isAdmin()){
      this.displayedColumns.unshift('id');
    }
  }

  get mapsNo():number{
    return this.mapsData !== null ? this.mapsData.data.length : 0;
  }

  get isLoggedIn():Boolean{
    return this.rimaAAAService.getUser() !== null;
  }

  userName():string{
    return this.rimaAAAService.userName();
  }

  public userAvatar():Observable<string>{
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }

  public creatorAvatar(id:string):Observable<string>{
    // (this.creators[id] as Observable<KNode>).subscribe( function(user:KNode){
    //   return RimaAAAService.userAvatar(user);
    // }
    return of ('');
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

  openMap(map:KMap):void{
    console.log('openMap', map);
    // this.snackBar.open("Map Openning", "To be implemented", {duration: 1000});
    this.router.navigate(['/map-new/id/',map._id]);
    // ('/map-new/id/' + map._id)
    // if (!item) { // && this.selectedItem !== null && this.selectedItem !== undefined
    //     item = this.selectedItem;
    // }
    // if (item) {
    //     console.log("openning Model:" + item.name + ": " + item._id);
    //     console.log("/map/id/" + item._id);
    //     //$location.path("/map/id/" + item._id);
    //     //TODO: using ng2 Route mechanism:
    //     //this.router.url = "/map/id/" + item._id; //navigate(['HeroDetail', { id: this.selectedHero.id }]);

    //     //TODO-remove: this.policyConfig.moderating.enabled = false;
    //     var location = "#" + (mapRoute ? mapRoute.route : this.mapRoutes[0].route) + "/id/" + item._id;
    //     console.log("location: ", location);
    //     window.location.href = location;
    //     //openMap(item);
    //     // $element.remove();
    // } else {
    //     window.alert('Please, select a Map');
    // }
  }

  deleteMap(map:KMap):void{
    console.log('deleteMap', map);
    function deleteConfirmation(btn:number):void{
      console.log('[deleteConfirmation] btn',btn);
      function mapDeleted(result:boolean) {
        console.log('mapDeleted:result:' + result);
        if(result){
          // let maps:KMap[] = this.mapsData.data;
          this.mapsData.data.splice(this.mapsData.data.findIndex(mapInList => {return mapInList._id === map._id;}),1);
          // this.selectedItem = null;
          this.setUpSourceData();
        }
      }
      if(btn===1)
      {
        console.log('deleting map: '+map.name);
        // var that:MapsListComponent = this;
        this.knalledgeMapService.destroy(map._id).subscribe(mapDeleted.bind(this));
      }
    }

    let BottomShDgData:BottomShDgData = {title:'Map Deleting', message:'You want to delete the map "' + map.name + '"?', btn1:'Yes', btn2:'No', callback:deleteConfirmation.bind(this)};
    let bottomSheetRef:MatBottomSheetRef = this.bottomSheet.open(BottomShDg, { data: BottomShDgData }); //, disableClose: true 
  }

  editMap(map:KMap):void{
    //TODO:
      console.log('editMap', map);
      this.snackBar.open("Map Editing", "To be implemented", {duration: 1000});
  }

  cloneMap(map:KMap):void{
    //TODO:
      console.log('cloneMap', map);
      this.snackBar.open("Map Cloning", "To be implemented", {duration: 1000});
      //prepareForCloning(map); cloneDialog.show();
  }

  showParticipants(map:KMap):void{
    //TODO:
      console.log('showParticipants', map);
      this.snackBar.open("Map Participants", "To be implemented", {duration: 1000});
      //prepareForParticipants(item); participantsList.show()
  }
  
  exportMap(map:KMap):void{
    //TODO:
      console.log('exportMap', map);
      this.snackBar.open("Map Exporting", "To be implemented", {duration: 1000});
      // this.knalledgeMapVOsService.mapExport(map._id, this.mapExported);
  }

  showMapCreateForm():void {
    if (this.rimaAAAService.getUser()){
        console.log("[showMapCreateForm]");
        let mapToCreate = new KMap();
        mapToCreate.participants = [this.rimaAAAService.getUserId()];
        //this.mapToCreate.participants = this.rimaAAAService.getWhoAmI().displayName;
        this.modeCreating = true;
        // this.mapCreateForm.show(null, this.mapCreateFormClosed.bind(this));
        
        // this.mapFormShow(this.mapToCreate);
        let mapCreateFormData: MapCreateFormData = {map:null, callback:this.mapCreateFormClosed.bind(this)};
        let bottomSheetRef:MatBottomSheetRef = this.bottomSheet.open(MapCreateForm, { data: mapCreateFormData, disableClose: true });
    }else{
      window.alert("You must be logged in to create a map");
    }
  }

  showMapImportForm():void {
    this.snackBar.open("To be implemented", null, {duration: 1000});
  }

  public mapCreateFormClosed(map:KMap):void{
    this.modeCreating = false;
    console.log('mapCreateFormClosed',map);
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

  public canIManageTheMap(map:KMap):boolean{
    return map.iAmId === this.rimaAAAService.getUserId() || this.rimaAAAService.isAdmin() || this.isMapModerator(map);
  }

  isMapModerator(map:KMap):boolean{
    //TODO:
    return false;
  }

  creatorReceived(creator:KNode):void{ //memoization fn
    if(creator!==null)
    {
      // console.log('[creatorReceived]', creator, creator.name, creator._id);
      this.creators[creator._id] = of(creator);
    }
    else{
      console.warn('[creatorReceived] user not find');
    }
  }

  private log(message: string) {
    console.log(`Log: ${message}`);
  }

  printCreator(id:string):Observable<KNode>{
    // id = '5bebb889104bee65c14402e6';
    
    /*
    //mockuping:
    let user:KNode = new KNode();
    user.name = 'demo user';
    return of(user);
    */
   
    if(id in this.creators){
      // console.log('[printCreator] found in memoization', this.creators[id]);
      return this.creators[id];
    }
    else{
      console.log('[printCreator] id not found in memoization');
      // console.log('this.creators',this.creators);
      let result:Observable<KNode> = this.rimaAAAService.getUserById(id);
      // .pipe(
      //   // tap(_ => this.creatorReceived.bind(this)),
      //   // tap(user => console.log('[printCreator]', user)),
      //   // tap(_ => this.log('fetched heroes'))
      // )
      result.subscribe(this.creatorReceived.bind(this));
      
      // adding it so that the new request for the same author is not sent (the same user can be creator of many maps)
      // especially important if the user is not found, so he would not be added in the subscribed method:
      this.creators[id] = result;
      return result;
    }
    //TODO: IMG
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

  printPublicity(isPublic:boolean):string{
    return isPublic ? '' : '<mat-icon>lock</mat-icon>';
  }
}
