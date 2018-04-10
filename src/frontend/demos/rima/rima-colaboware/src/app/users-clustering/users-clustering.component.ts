import { Component, OnInit } from '@angular/core';
import {ClusterVO} from './clusterVO';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {UsersProfilingService} from '../users-profiling/users-profiling.service';

@Component({
  selector: 'app-users-clustering',
  templateUrl: './users-clustering.component.html',
  styleUrls: ['./users-clustering.component.css']
})
export class UsersClusteringComponent implements OnInit {

  constructor(
    private usersProfilingService: UsersProfilingService
  ) { }

  clusterUsers():void{
    console.log('users:',this.usersProfilingService.users)
  }

  ngOnInit() {
  }

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

  clusterDiverseBackgroundSharedInterests(users:KNode[]):ClusterVO{
    let cluster:ClusterVO = new ClusterVO();
    //TODO: ...
    return cluster;
  }

}
