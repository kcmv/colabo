import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {ClusteringConnection} from './clusteringConnection';
// interface IDictionary {
//     [key: string]: number;
// }

export class ClusteringUser{
  user: KNode;
  desiredRole: string; // role is contained in 'user.dataContent.userProfilingData.role', but here we store the old role, the one desired by user, after the algorithm assigm him a new role (because the desired is not available for him)
  connections:ClusteringConnection[] = [];//IDictionary = {};

  constructor(user:KNode){
    this.user = user;
    this.desiredRole = user.dataContent.userProfilingData.role;
  }

  isConnectedTo(id:string):boolean{
    for(var connection in this.connections){
      if((this.connections[connection] as ClusteringConnection).to == id){
        return true;
      }
    }
    return false;
  }

  getConnectionTo(id:string):ClusteringConnection{
    for(var connection in this.connections){
      if((this.connections[connection] as ClusteringConnection).to == id){
        return this.connections[connection];
      }
    }
    return null;
  }

  addConnection(to:string, increaseStrengthForExisting:boolean = false):void{
    if (!this.isConnectedTo(to)){
      this.connections[to] = new ClusteringConnection(this.user._id,to);
    }
    else{
      if(increaseStrengthForExisting){ //if the connection already exists and we don't want to increase, we don't do anything
        this.connections[to].strength++;
      }
    }
  }
}
