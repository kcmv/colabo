import { Component, OnInit } from '@angular/core';
import {ClusterVO} from './clusterVO';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'app-users-clustering',
  templateUrl: './users-clustering.component.html',
  styleUrls: ['./users-clustering.component.css']
})
export class UsersClusteringComponent implements OnInit {

  constructor() { }

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
    - tries to gather users based on shared interest to foster motiviation for shared work, and motivation regarding the topic of collective work
  */
  clusterDiverseBackgroundSharedInterests(users:KNode[]):ClusterVO{
    let cluster:ClusterVO = new ClusterVO();
    //TODO: ...
    return cluster;
  }

}
