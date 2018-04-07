import { Injectable } from '@angular/core';
import { KeyboardRFIDInterface} from './KeyboardRFIDInterface';
import { CoLaboWareType } from '@colabo-colaboware/colaboware_core/coLaboWareData';
import { CoLaboWareData } from '@colabo-colaboware/colaboware_core/coLaboWareData';

declare var ColabowareKeyboard;

const RFID_LENGTH:number = 10;

@Injectable()
export class ColabowareRFIDService {
  keyboard:KeyboardRFIDInterface;
  enabled:boolean = true;
  keyID:string = "";

  constructor() {
    this.keyboard = new KeyboardRFIDInterface();
    this.initializeKeyboard();
  }

  checkRFID(id:string){
    if(id.length != RFID_LENGTH) return false;

    return true;
  }

  keyIsReceived(event){
    if(this.enabled){
      console.log("Key: " + event.key);
      if(event.key.toLowerCase() === 'enter'){
        if(this.checkRFID(this.keyID)){
          console.log("Sending RFID: " + this.keyID);
          var data:CoLaboWareData = new CoLaboWareData();
          data.type = CoLaboWareType.RFID;
          data.value = this.keyID;
          console.log("CoLaboWareData: ", data);
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
    this.keyboard.registerKey('*', ['enter', 'any number'], null, this.keyIsReceived.bind(this));
  }
}
