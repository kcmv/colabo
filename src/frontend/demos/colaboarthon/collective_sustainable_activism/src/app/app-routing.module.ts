import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { UsersProfilingComponent } from './users-profiling/users-profiling.component';
import { UsersClusteringComponent } from './users-clustering/users-clustering.component';
import { UsersPopulationComponent } from './users-population/users-population.component';
import { TagsPopulationComponent } from './tags-population/tags-population.component';
import {UsersGroupsComponent} from './users-groups/users-groups.component';
import {UiSmsComponent} from './ui-sms/ui-sms.component';
import {PromptsPresentationComponent} from './prompts-presentation/prompts-presentation.component';
import {RimaRegisterComponent} from './rima-register/rima-register.component';

UsersGroupsComponent
const routes: Routes = [
  { // default route
    path: '',
    redirectTo: '/rima-register',
    pathMatch: 'full'
  },
  {
    path: 'ui-sms',
    component: UiSmsComponent
  },
  {
    path: 'prompts-presentation',
    component: PromptsPresentationComponent
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
  },
  {
    path: 'rima-register',
    component: RimaRegisterComponent
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
