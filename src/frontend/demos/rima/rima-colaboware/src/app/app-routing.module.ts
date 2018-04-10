import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { UsersProfilingComponent } from './users-profiling/users-profiling.component';
import { UsersClusteringComponent } from './users-clustering/users-clustering.component';

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
