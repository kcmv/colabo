import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

export enum ConnectionStatus{
  DISABLED = 0,
  NORMAL = 1,
  SEALED = 2
}

export class ClusteringConnection{
  from: string;
  to: string;
  strength: number;
  status: number;
}
