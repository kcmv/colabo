import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {ClusterVO} from './clusterVO';
import {AttributesPerUser} from '../users-profiling/users-profiling.service';
import {ClusteringUser} from './clusteringUser';
import {Group} from './group';

@Injectable()
export class UsersClusteringService {
  //clusterVO:ClusterVO = new ClusterVO();

  /*
    the **GOAL** of this clustering is to find communities (groups) focused on improving collective creativity
    USER ATTRIBUTES in considerations:
    - background: professional background, level of epertise
    - demographics: age, cultural
    - shared interests
    The algorithm tries to form groups in such way that
    - they are diverse by background - to introduce different views, attitudes, fresh views,
    - tries to make it balanced, to avoid COMMON INFORMATION EFFECT
    - should try to avoid disciplinary faultlines
    - tries to gather users based on shared interest to foster motiviation for shared work,
    and motivation regarding the topic of collective work

    In this version:
    - we are considering the case when we have exactly one diversity attribute (the role of the player)
    and the group size is equal to the number of different roles/options for that attribute
    - we consider diversification/roles more important than similarity in this scenario,
    so we first divide all participants in groups on the criteria of the role.
    - then we calculate similarities with other partic, based on shared interests
    - first we take in consideration those that are connected with 1 another participant, then those with 2, ...
    because they are the least connected
    (in this consideration we take out connections with participants with the same role)
    but those with 0 connections, we leave at the end because it's the same for them where ever they are
  */

  buildInterestBasedConnections(users:KNode[], cluster:ClusterVO):ClusterVO{
    for(let i:number = 0; i<users.length;i++){
      let user1:KNode = users[i];
      let clusteringUser:ClusteringUser = new ClusteringUser(user1);
      cluster.clusteringUsers.push()
      for(let j:number = 0; j<users.length;j++){
        if(i !== j){
          //the same 'reflected' user
          let user2:KNode = users[j];
          for(let interestI:number = 0; interestI<AttributesPerUser;interestI++){
            if(user1.dataContent.userProfilingData.attributes[interestI] == user2.dataContent.userProfilingData.attributes[interestI]){
              clusteringUser.addConnection(user2._id, true);
            }
          }
        }
      }
      cluster.clusteringUsers.push(clusteringUser);
    }
    console.log('clusteringUser:', cluster.clusteringUsers);
    return cluster;
  }

  clusterDiverseBackgroundSharedInterests(users:KNode[]):ClusterVO{
    let cluster:ClusterVO = new ClusterVO();
    let groups:Group[] = [];
    cluster = this.buildInterestBasedConnections(users, cluster);

    //TODO: ...
    return cluster;
  }
}
