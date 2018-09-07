import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

// import { UsersProfilingComponent } from './users-profiling/users-profiling.component';
// import { UsersClusteringComponent } from './users-clustering/users-clustering.component';
// import { UsersPopulationComponent } from './users-population/users-population.component';
// import { TagsPopulationComponent } from './tags-population/tags-population.component';
// import {UsersGroupsComponent} from './users-groups/users-groups.component';
// import {UiSmsComponent} from './ui-sms/ui-sms.component';
// import {PromptsPresentationComponent} from './prompts-presentation/prompts-presentation.component';
import {IndexComponent} from './index/index.component';
import {RimaRegisterComponent} from '@colabo-rima/rima_aaa/rima-register/rima-register.component';
import {SelectSdgsComponent} from './select-sdgs/select-sdgs.component';
import {CwcComponent} from './cwc/cwc.component';
import { RimaLoginComponent } from '@colabo-rima/rima_aaa/rima-login/rima-login.component';
import {AvatarComponent} from './avatar/avatar.component';
import {InsightsComponent} from './insights/insights.component';

const routes: Routes = [
  { // default route
    path: '',
    pathMatch: 'full',
    component: IndexComponent
  },
  // {
  //   path: 'ui-sms',
  //   component: UiSmsComponent
  // },
  // {
  //   path: 'prompts-presentation',
  //   component: PromptsPresentationComponent
  // },
  // {
  //   path: 'users-profiling',
  //   component: UsersProfilingComponent
  // },
  // {
  //   path: 'users-clustering',
  //   component: UsersClusteringComponent
  // },
  // {
  //   path: 'users-population',
  //   component: UsersPopulationComponent
  // },
  // {
  //   path: 'tags-population',
  //   component: TagsPopulationComponent
  // },
  // {
  //   path: 'users-groups',
  //   component: UsersGroupsComponent
  // },
  {
    path: 'rima-register',
    component: RimaRegisterComponent
  },
  {
    path: 'rima-login',
    component: RimaLoginComponent
  },
  {
    path: 'select-sdgs',
    component: SelectSdgsComponent
  },
  {
    path: 'cwc',
    component: CwcComponent
  },
  {
    path: 'avatar',
    component: AvatarComponent
  },
  {
    path: 'insights',
    component: InsightsComponent
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
