// https://github.com/angular/angular/blob/master/modules/@angular/src/upgrade/upgrade_adapter.ts
// http://stackoverflow.com/questions/39148710/where-to-put-the-import-module-in-a-new-installation-of-ng-2-bootstrap
// http://stackoverflow.com/questions/39166395/how-do-i-upgrade-modules-to-angular-2-rc5-ngmodules-in-a-hybrid-application

import {UpgradeAdapter} from '@angular/upgrade';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@angular/material';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2MaterialModule} from 'ng2-material';

// providers
import {ChangeService} from '../components/change/change.service';
// upgradeAdapter.addProvider(ChangeService);
import {CollaboGrammarService} from '../components/collaboPlugins/CollaboGrammarService';
import {BrainstormingService} from '../components/brainstorming/brainstorming.service';
import {SessionService} from '../components/session/session.service';

var moduleProviders = [
  // MATERIAL_PROVIDERS,
  // DbAuditService,
  // ChangeService
  // provideRouter
  // RequestService
  // ROUTER_PROVIDERS
  // BrainstormingService

    // ChangeService,
    // CollaboGrammarService,
    // BrainstormingService,
    // SessionService
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // RouterModule.forRoot(DEMO_APP_ROUTES),
    MaterialModule.forRoot(),
    Ng2MaterialModule
  ],
  declarations: [
    // DemoApp,
  ],
  providers: moduleProviders,
  // entryComponents: [
  //   // DemoApp,
  // ],
})
export class AppModule {}

export const upgradeAdapter = new UpgradeAdapter(AppModule);
