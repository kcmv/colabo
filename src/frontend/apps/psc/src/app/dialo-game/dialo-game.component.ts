import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {DialoGameService} from './dialo-game.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {Dialog1Btn, Dialog2Btn, DialogData} from '../util/dialog';
import {DialogameCardsComponent} from './dialogame-cards/dialogame-cards.component'

@Component({
  selector: 'app-dialo-game',
  templateUrl: './dialo-game.component.html',
  styleUrls: ['./dialo-game.component.css']
})
export class DialoGameComponent implements OnInit {

  @ViewChild(DialogameCardsComponent)
  private dialogameCardsComponent: DialogameCardsComponent;
  public myResponseOpen:boolean = true;

  dialogRef: any; //TODO: type: MatDialogRef;
  private initialized:boolean = false;

  constructor(
    private dialoGameService: DialoGameService,
    private rimaAAAService: RimaAAAService,
    public dialog: MatDialog
  ) { }

  get isLoggedIn():Boolean{
    return this.rimaAAAService.getUser() !== null;
  }

  ngOnInit() {
    /* we use the 'initialized' variable to surpress Development-mode error "Expression has changed after it was checked"
    //more about it at: https://github.com/Cha-OS/colabo/issues/339#issuecomment-422012856
    yet this problem is not solved by this, we need something that is called after ngOnInit ...
    //it is caused if we use:
    // <button *ngIf='canUndo()' mat-raised-button (click)="undo()">Undo</button>
    // instead of
    // <span [hidden]='!canUndo()'><button mat-raised-button (click)="undo()">Undo</button></span>
    */
    //this.initialized = true;
  }

  userImg():string{
    return 'assets/images/user_icons/performer.jpg';
  }

  waitingForNextRound():boolean{
    return this.dialoGameService.waitingForNextRound();
  }

  playing():boolean{
    return this.dialoGameService.playing();
  }

  userName():string{
    return this.rimaAAAService.getUser() !== null ? this.rimaAAAService.getUser().name : 'not logged in';
  }

  openDialog(buttons:number, data:DialogData, options:any = null, afterClosed:Function = null): void {
    if(options === null){
      options = {};
    }
    options['width'] = '95%'
    options['data'] = data;
    console.log('openDialog',options);
    this.dialogRef = this.dialog.open((buttons == 1 ? Dialog1Btn : Dialog2Btn), options);
    if(afterClosed){this.dialogRef.afterClosed().subscribe(afterClosed);}
  }

  canUndo():boolean{
    return this.dialoGameService.canUndo();
    //return this.initialized && this.dialoGameService.canUndo();
  }

  canFinish():boolean{
    return this.dialoGameService.canFinish();
    //return this.initialized && this.dialoGameService.canFinish();
  }

  undo():void{
    this.dialoGameService.undo();
    this.dialoGameService.getCards().subscribe(this.dialogameCardsComponent.cardsReceived.bind(this.dialogameCardsComponent));
  }

  finish():void{
    this.openDialog(2, new DialogData('Finishing the move','Do you want to finish this move, without further decorating your card?', 'No', 'Yes'), null, this.finished.bind(this));
  }

  finished(result:any):void{
     console.log('The dialog was closed', result);
     if(result){
       this.savePlayedMove();
     }
  }

  savePlayedMove():void{
    this.dialoGameService.saveDialoGameResponse();
  }

}
