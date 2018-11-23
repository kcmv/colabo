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
import { IndexModeratorComponent } from './index-moderator/index-moderator.component';
import {RimaRegisterComponent} from '@colabo-rima/f-aaa/rima-register/rima-register.component';
import {SelectSdgsComponent} from './select-sdgs/select-sdgs.component';
import {CwcComponent} from './cwc/cwc.component';
import { RimaLoginComponent } from '@colabo-rima/f-aaa/rima-login/rima-login.component';
import { AvatarComponent } from '@colabo-media/f-upload';
// import {InsightsComponent} from './insights/insights.component';
import {DialoGameComponent} from './dialo-game/dialo-game.component'; //PTW
import {ModerationPanelComponent} from '@colabo-moderation/f-core';
//import { ModerationCoreModule } from '@colabo-moderation/f-core/lib/module';
import {TopiChatTalkForm} from '@colabo-topichat/f-talk';
import { TopiChatClientsOrchestrationForm } from '@colabo-topichat/f-clients-orchestration';
import { MapComponent } from '@colabo-knalledge/f-map';
// import { ResultsVisualizationComponent } from '@colabo-moderation/f-core/lib/module';
import { ResultsVisualizationComponent } from '@colabo-moderation/f-core';

const routes: Routes = [
  { // default route
    path: '',
    pathMatch: 'full',
    component: IndexComponent
  },
  {
    path: 'moderator',
    pathMatch: 'full',
    component: IndexModeratorComponent
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
  // {
  //   path: 'cwc',
  //   component: CwcComponent
  // },
  {
    path: 'avatar',
    component: AvatarComponent
  },
  {
    path: 'moderation-panel',
    component: ModerationPanelComponent
  },
  // {
  //   path: 'insights',
  //   component: InsightsComponent
  // },
  {
    path: 'dialo-game',
    component: DialoGameComponent
  },
  {
    path: 'cwc',
    component: TopiChatTalkForm
  },
  {
    path: 'talk',
    component: TopiChatTalkForm
  },
  {
    path: 'orchestration',
    component: TopiChatClientsOrchestrationForm
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'results',
    component: ResultsVisualizationComponent
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
