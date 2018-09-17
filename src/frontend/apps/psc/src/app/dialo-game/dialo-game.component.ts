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

  // @ViewChild(DialogameCardsComponent)
  // private dialogameCardsComponent: DialogameCardsComponent;

  dialogRef: any; //TODO: type: MatDialogRef;

  constructor(
    private dialoGameService: DialoGameService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
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
  }

  canFinish():boolean{
    return this.dialoGameService.canFinish();
  }

  undo():void{
    this.dialoGameService.undo();
    //this.dialoGameService.getCards().subscribe(this.dialogameCardsComponent.cardsReceived);
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
