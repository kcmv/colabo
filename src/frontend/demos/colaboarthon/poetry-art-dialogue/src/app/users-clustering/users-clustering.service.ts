import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {ClusterVO} from './clusterVO';
import {AttributesPerUser} from '../users-profiling/users-profiling.service';
import {ClusteringUser} from './clusteringUser';
import {Group} from './group';
import {ClusteringConnection} from './clusteringConnection';
import {ConnectionStatus} from './clusteringConnection';
import {Roles} from '../users-profiling/users-profiling.service';
import {UserProfilingData} from '../users-profiling/userProfilingData';

@Injectable()
export class UsersClusteringService {
  cluster:ClusterVO = new ClusterVO();
  groups:Group[] = [];

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

  getUserById(users:KNode[], id:string):KNode{
    for (var i=0;i<users.length;i++){
      if(users[i]._id === id){
        return users[i];
      }
    }
    return null;
  }

  getConnectionsToUsersWithDifferentRole(clUser:ClusteringUser, users:KNode[]){
    let connections:ClusteringConnection[] = [];
    let myRole:Roles = clUser.user.dataContent.userProfilingData.role;
    for(var connection in clUser.connections){
      let destinationUserId:string = (clUser.connections[connection] as ClusteringConnection).to;
      //TODO: should be this.usersProfilingService.getUserById(destinationUserId)):
      if((this.getUserById(users,destinationUserId).dataContent.userProfilingData.role
      !== myRole) && clUser.connections[connection].status == ConnectionStatus.NORMAL){
        connections.push(clUser.connections[connection]);
      }
    }
    return connections;
  }

  printConnections(cluster:ClusterVO):void{
    //   1 2 3 4 5 6 7 8 9
    // 1 x   y
    // 2   z
    // 3
    // 4
    let connection:ClusteringConnection = null;
    let str:string = "    ";
    const MAX_USER_ID:number = 11;
    for(var j:number=1;j<=MAX_USER_ID;j++){
      str+=j+"  ";
    }
    console.log(str);
    for(let i:number = 0; i<cluster.clusteringUsers.length;i++){
      let clUser:ClusteringUser = cluster.clusteringUsers[i];
      let role:Roles = (clUser.user.dataContent.userProfilingData as UserProfilingData).role;
      let roleS:string = "R";
      if(role === Roles.LOCAL){roleS = 'L';}
      if(role === Roles.ACTIVIST){roleS = 'A';}
      str = clUser.user._id +  roleS + ': ';
      for(var j:number=1;j<=MAX_USER_ID;j++){ //TODO: working with node ids, not the hardcoded ones:
        connection = clUser.getConnectionTo(j+"");
        let strengthS:string = "N";
        if(connection !== null){
          if(connection.status == ConnectionStatus.DISABLED){strengthS = "D";}
          if(connection.status == ConnectionStatus.SEALED){strengthS = "S";}
        }
        str += (connection === null ? (j>9 ? "    " : "   ") : connection.strength+strengthS + (j>9 ? "   " : "  "));
      }
      console.log(str);
    }
  }

  //these users don't have only one user of a different role to be connected into a group
  //that means that we have to treat them in first place
  sealAllwithOneAvailableConnection(users:KNode[], cluster:ClusterVO):ClusterVO{
    for(let i:number = 0; i<cluster.clusteringUsers.length;i++){
      let clUser:ClusteringUser = cluster.clusteringUsers[i];
      let connections:ClusteringConnection[] = this.getConnectionsToUsersWithDifferentRole(clUser,users);
        if(connections.length === 1){
          //TODO: what if the connection leads to th user with the same role as of one to whom we're already sealed?
            connections[0].status = ConnectionStatus.SEALED;
        }
      }
    return cluster;
  }

  clusterDiverseBackgroundSharedInterests(users:KNode[]):ClusterVO{
    this.cluster = new ClusterVO();
    this.groups = [];
    this.cluster = this.buildInterestBasedConnections(users, this.cluster);
    this.printConnections(this.cluster);
    this.sealAllwithOneAvailableConnection(users,this.cluster);

    //TODO: ...
    return this.cluster;
  }

  /**
  1. chaning roles to make equal roles number
  2. in the rest of the process we don't examine interest-connections between users with the same role

  */
  clusterDiverseBackgroundSharedInterestsLight(users:KNode[]):ClusterVO{
    this.cluster = new ClusterVO();
    this.groups = [];

    // resetting group ids
    Group.MaxId = 0;

    // resetting each user
    for(let u:number = 0; u<users.length;u++){
      let user = users[u];
      let userProfilingData = (user.dataContent.userProfilingData as UserProfilingData);
      // resetting group ids of each user
      userProfilingData.group = null;
    }

    this.cluster = this.buildInterestBasedConnections(users, this.cluster);
    this.printConnections(this.cluster);
    //adding refugees to the groups they "lead":
    for(let uR:number = 0; uR<users.length;uR++){
      let userR = users[uR];
      let userProfilingDataR = (userR.dataContent.userProfilingData as UserProfilingData);

      if(userR.dataContent.userProfilingData.role === Roles.REFUGEE){
        let group:Group = new Group();
        group.refugee = userR;
        userProfilingDataR.group = group._id;
        this.groups.push(group);
        group.name = "" + this.groups.length;
        console.log("[clusterDiverseBackgroundSharedInterestsLight] created new group: ", group.name);
      }
    } //!!! after this, a local still may be null if there was less locals then refugees

    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding LOCALS to the groups, 1st round.");
    //adding LOCALS to the group - 1st round:
    for(let gL1:number = 0; gL1<this.groups.length;gL1++){
      let groupL1:Group = this.groups[gL1];
      let refugeeL1:KNode = groupL1.refugee;
      // // if the group does already have a local
      if(groupL1.local !== null) continue;

      for(let uL1:number = 0; uL1<users.length; uL1++){
        let userL1:KNode = users[uL1];
        let userProfilingDataL1:UserProfilingData = (userL1.dataContent.userProfilingData as UserProfilingData);
        if(userProfilingDataL1.role === Roles.LOCAL &&
          userProfilingDataL1.group === null)
        { // if local, not yet in a group
          let refugeeCLUL1:ClusteringUser = this.cluster.getClusteringUserbyUserId(refugeeL1._id);
          if(refugeeCLUL1 && refugeeCLUL1.isConnectedTo(userL1._id)){
              groupL1.local = userL1;
              userProfilingDataL1.group = groupL1._id;
              break;
          }
        }
      }
    }

    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding LOCALS to the groups, 2nd round.");
    //adding LOCALS to the group - 2nd round:
    for(let gL2:number = 0; gL2<this.groups.length;gL2++){
      let groupL2:Group = this.groups[gL2];
      let refugeeL2:KNode = groupL2.refugee;
      // if the group does already have a local
      if(groupL2.local !== null) continue;

      for(let uL2:number = 0; uL2<users.length;uL2++){
        let userL2:KNode = users[uL2];
        let userProfilingDataL2:UserProfilingData = userL2.dataContent.userProfilingData;
        if(userProfilingDataL2.role === Roles.LOCAL &&
          userProfilingDataL2.group === null)
        { // we add the first local, that is not yet in a group
          groupL2.local = userL2;
          userProfilingDataL2.group = groupL2._id;
          break;
        }
      }
    }

    //adding ACTIVIST to the group - 1st round:
    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding ACTIVIST to the groups, 1st round.");
    for(let gA1:number = 0; gA1<this.groups.length; gA1++){
      let groupA1:Group = this.groups[gA1];
      let refugeeA1:KNode = groupA1.refugee;
      let localA1:KNode = groupA1.local;
      // // if the group does already have a activist
      if(groupA1.activist !== null) continue;

      for(let uA1:number = 0; uA1<users.length;uA1++){
        let userA1:KNode = users[uA1];
        let userProfilingDataA1:UserProfilingData = (userA1.dataContent.userProfilingData as UserProfilingData);
        if(userProfilingDataA1.role === Roles.ACTIVIST &&
          userProfilingDataA1.group === null)
        { // if activist, not yet in a group
          let refugeeCLUA1:ClusteringUser = this.cluster.getClusteringUserbyUserId(refugeeA1._id);
          let localCLUA1:ClusteringUser = ((localA1 !== null) ? this.cluster.getClusteringUserbyUserId(localA1._id) : null); //local may be null if there was less locals then refugees

          if((refugeeCLUA1 && refugeeCLUA1.isConnectedTo(userA1._id)) || (localCLUA1 && localCLUA1.isConnectedTo(userA1._id)))
          { // if a refugee or a local is connected to the activist, add the activist
            groupA1.activist = userA1;
            userProfilingDataA1.group = groupA1._id;
            break;
          }
        }
      }
    }

    //adding ACTIVIST to the group - 2nd round:
    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding ACTIVIST to the groups, 2nd round.");
    for(let gA2:number = 0; gA2<this.groups.length;gA2++){
      let groupA2:Group = this.groups[gA2];
      let refugeeA2:KNode = groupA2.refugee;
      let activistA2:KNode = groupA2.activist;
      // if the group does already have an activist
      if(groupA2.activist !== null) continue;

      for(let uA2:number = 0; uA2<users.length;uA2++){
        let userA2:KNode = users[uA2];
        let userProfilingDataA2:UserProfilingData = (userA2.dataContent.userProfilingData as UserProfilingData);
        if(userProfilingDataA2.role === Roles.ACTIVIST &&
          userProfilingDataA2.group === null){ // if activist, not yet in a group
            groupA2.activist = userA2;
            userProfilingDataA2.group = groupA2._id;
            break;
        }
      }
    }

    //TODO: see what to return. We need group and not cluster, but maybe cluster may contain the group
    console.log("[clusterDiverseBackgroundSharedInterestsLight] Created groups. Gropus num: ", this.groups.length);

    console.log('groups:', this.groups);
    return this.cluster;
  }
}
