import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

export enum ConnectionStatus{
  DISABLED = 0,
  NORMAL = 1,
  SEALED = 2
}

export class ClusteringConnection{
  from: string;
  to: string;
  strength: number = 1;
  status: number = ConnectionStatus.NORMAL;

  constructor(from:string,to:string){
    this.from = from;
    this.to = to;
  }
}
