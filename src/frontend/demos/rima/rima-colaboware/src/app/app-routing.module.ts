import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { UsersProfilingComponent } from './users-profiling/users-profiling.component';

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
