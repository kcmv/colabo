import { Injectable } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
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
      let userProfilingData = (userR.dataContent.userProfilingData as UserProfilingData);

      if(userR.dataContent.userProfilingData.role === Roles.REFUGEE){
        let group:Group = new Group();
        group.refugee = userR;
        userProfilingData.group = group._id;
        this.groups.push(group);
        group.name = "" + this.groups.length;
        console.log("[clusterDiverseBackgroundSharedInterestsLight] created new group: ", group.name);
      }
    } //!!! after this, a local still may be null if there was less locals then refugees

    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding LOCALS to the groups, 1st round.");
    //adding LOCALS to the group - 1st round:
    for(let gL1:number = 0; gL1<this.groups.length;gL1++){
      let group:Group = this.groups[gL1];
      let refugee:KNode = group.refugee;
      for(let uL1:number = 0; uL1<users.length; uL1++){
        let userL1:KNode = users[uL1];
        if(userL1.dataContent.userProfilingData.role === Roles.LOCAL &&
          (userL1.dataContent.userProfilingData as UserProfilingData).group === null){ // if local, not yet in a group
          let refugeeCLU:ClusteringUser = this.cluster.getClusteringUserbyUserId(refugee._id);
          if(refugeeCLU && refugeeCLU.isConnectedTo(userL1._id)){
              group.local = userL1;
              (userL1.dataContent.userProfilingData as UserProfilingData).group = group._id;
          }
        }
      }
    }

    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding LOCALS to the groups, 2nd round.");
    //adding LOCALS to the group - 2nd round:
    for(let gL2:number = 0; gL2<this.groups.length;gL2++){
      let group:Group = this.groups[gL2];
      let refugee:KNode = group.refugee;
      if(group.local === null){ // if the group doesn't already have a local:
        for(let u:number = 0; u<users.length;u++){
          let userL2:KNode = users[u];
          if(userL2.dataContent.userProfilingData.role === Roles.LOCAL &&
            (userL2.dataContent.userProfilingData as UserProfilingData).group === null)
          { // we add the first local, that is not yet in a group
            group.local = userL2;
            (userL2.dataContent.userProfilingData as UserProfilingData).group = group._id;
          }
        }
      }
    }

    //adding ACTIVIST to the group - 1st round:
    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding ACTIVIST to the groups, 1st round.");
    for(let gA1:number = 0; gA1<this.groups.length; gA1++){
      let group:Group = this.groups[gA1];
      let refugee:KNode = group.refugee;
      let local:KNode = group.local;
      for(let uA1:number = 0; uA1<users.length;uA1++){
        let userA1:KNode = users[uA1];
        if(userA1.dataContent.userProfilingData.role === Roles.ACTIVIST &&
          (userA1.dataContent.userProfilingData as UserProfilingData).group === null)
        { // if activist, not yet in a group
          let refugeeCLU:ClusteringUser = this.cluster.getClusteringUserbyUserId(refugee._id);
          let localCLU:ClusteringUser = ((local !== null) ? this.cluster.getClusteringUserbyUserId(local._id) : null); //local may be null if there was less locals then refugees

          if((refugeeCLU && refugeeCLU.isConnectedTo(userA1._id)) || (localCLU && localCLU.isConnectedTo(userA1._id)))
          { // if a refugee or a local is connected to the activist, add the activist
            group.activist = userA1;
            (userA1.dataContent.userProfilingData as UserProfilingData).group = group._id;
          }
        }
      }
    }

    //adding ACTIVIST to the group - 2nd round:
    // console.log("[clusterDiverseBackgroundSharedInterestsLight] adding ACTIVIST to the groups, 2nd round.");
    for(let gA2:number = 0; gA2<this.groups.length;gA2++){
      let group:Group = this.groups[gA2];
      let refugee:KNode = group.refugee;
      let activist:KNode = group.activist;
      if(group.activist === null){ // if the group doesn't already have an activist:
        for(let uA2:number = 0; uA2<users.length;uA2++){
          let userA2:KNode = users[uA2];
          if(userA2.dataContent.userProfilingData.role === Roles.ACTIVIST &&
            (userA2.dataContent.userProfilingData as UserProfilingData).group === null){ // if activist, not yet in a group
              group.activist = userA2;
              (userA2.dataContent.userProfilingData as UserProfilingData).group = group._id;
          }
        }
      }
    }

    //TODO: see what to return. We need group and not cluster, but maybe cluster may contain the group
    console.log("[clusterDiverseBackgroundSharedInterestsLight] Created groups. Gropus num: ", this.groups.length);

    console.log('groups:', this.groups);
    return this.cluster;
  }
}
