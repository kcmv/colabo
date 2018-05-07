import {ClusteringUser} from './clusteringUser'

/*
data required for the user clustering process
*/
export class ClusterVO{
  clusteringUsers:ClusteringUser[] = [];

  getClusteringUserbyUserId(id):ClusteringUser{
    for(var i in this.clusteringUsers){
      if(this.clusteringUsers[i].user._id === id){
        return this.clusteringUsers[i];
      }
    }
    return null;
  }
}
