import { Component, OnInit } from '@angular/core';
import {ClusterVO} from './clusterVO';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {UsersProfilingService} from '../users-profiling/users-profiling.service';
import {UsersClusteringService} from './users-clustering.service';

@Component({
  selector: 'app-users-clustering',
  templateUrl: './users-clustering.component.html',
  styleUrls: ['./users-clustering.component.css']
})
export class UsersClusteringComponent implements OnInit {

  constructor(
    private usersProfilingService: UsersProfilingService,
    private usersClusteringService: UsersClusteringService
  ) { }

  clusterUsers():void{
    console.log('users:',this.usersProfilingService.users);
    console.log('convertUserInterestsForAlgorithm...');
    this.usersProfilingService.convertUserInterestsForAlgorithm();
    console.log('users:',this.usersProfilingService.users);
    this.usersClusteringService.clusterDiverseBackgroundSharedInterestsLight(this.usersProfilingService.users);
  }

  convertUserInterestsForAlgorithm():void{
    this.usersProfilingService.convertUserInterestsForAlgorithm();
  }

  ngOnInit() {
  }
}
