import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { UsersProfilingComponent } from './users-profiling/users-profiling.component';
import { UsersClusteringComponent } from './users-clustering/users-clustering.component';
import { UsersPopulationComponent } from './users-population/users-population.component';
import { TagsPopulationComponent } from './tags-population/tags-population.component';
import {UsersGroupsComponent} from './users-groups/users-groups.component';

UsersGroupsComponent
const routes: Routes = [
  // default route
  {
    path: '',
    redirectTo: '/users-profiling',
    pathMatch: 'full'
  },
  {
    path: 'users-profiling',
    component: UsersProfilingComponent
  },
  {
    path: 'users-clustering',
    component: UsersClusteringComponent
  },
  {
    path: 'users-population',
    component: UsersPopulationComponent
  },
  {
    path: 'tags-population',
    component: TagsPopulationComponent
  },
  {
    path: 'users-groups',
    component: UsersGroupsComponent
  }
];

@NgModule({
  exports: [
    // makes router directives available for use in
    // other components that will need them
    RouterModule
  ],
  imports: [
    // initialize RouterModule with routes
    RouterModule.forRoot(routes)
  ]
})

export class AppRoutingModule { }
