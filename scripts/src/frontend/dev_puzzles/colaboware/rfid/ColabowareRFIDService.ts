import { Injectable } from '@angular/core';
import { KeyboardRFIDInterface} from './KeyboardRFIDInterface';
import { CoLaboWareType } from '@colabo-ware/core/coLaboWareData';
import { CoLaboWareData } from '@colabo-ware/core/coLaboWareData';

import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

declare var ColabowareKeyboard;

const RFID_LENGTH:number = 10;

/**
 * @classdesc ColabowareRFIDService is a service that provides RFID support.
 * It listens (through the KeyboardRFIDInterface interface) for a user providing RFID card at the reader and it emmits received card through the "colabowareIDProvided" event (by GlobalEmittersArrayService) as a CoLaboWareData object
 * @class KeyboardRFIDInterface
 */

@Injectable()
export class ColabowareRFIDService {
  keyboard:KeyboardRFIDInterface;
  enabled:boolean = true;
  keyboardHandler:any;
  keyID:string = "";

  // global event that is sent when RFID card is pressed
  colabowareIDProvided:string = "colabowareIDProvided";

  constructor(
    private globalEmitterServicesArray: GlobalEmittersArrayService
  ) {
    this.keyboard = new KeyboardRFIDInterface();
    this.initializeKeyboard();
    this.globalEmitterServicesArray.register(this.colabowareIDProvided);
  }

  // is the id a proper RFID
  checkRFID(id:string){
    if(id.length != RFID_LENGTH) return false;

    return true;
  }

  enable(){
    if(this.enabled) return;
    this.keyboard.activateHandler(this.keyboardHandler);
    this.enabled = true;
  }

  disable(){
    if(!this.enabled) return;
    this.keyboard.deactivateHandler(this.keyboardHandler);
    this.enabled = false;
  }

  // new key is received
  keyReceived(event){
    if(this.enabled){
      console.log("Key: " + event.key);
      // enter is signal that the whole RFID sequence is sent
      if(event.key.toLowerCase() === 'enter'){
        if(this.checkRFID(this.keyID)){
          console.log("Sending RFID: " + this.keyID);
          var data:CoLaboWareData = new CoLaboWareData();
          data.type = CoLaboWareType.RFID;
          data.value = this.keyID;
          console.log("CoLaboWareData: ", data);

          this.globalEmitterServicesArray.get(this.colabowareIDProvided)
          .broadcast('ColabowareRFIDService', data);
        }else{
          console.log("Error with RFID format");
        }
        this.keyID = "";
      }else{
        this.keyID += event.key;
      }
    }
  }

  initializeKeyboard(){
    this.keyboard.init();
    /**
     * toggling moderator
     */
    this.keyboardHandler = this.keyboard.registerKey('*', ['enter', 'any number'], null, this.keyReceived.bind(this));
  }
}
