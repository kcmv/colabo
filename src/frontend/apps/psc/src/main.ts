import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// let configFile = require('./config/global');
// import * as configFile from './config/global';
let configFile = (<any>window).globalSet;
console.log("[main] configFile.puzzles: %s", JSON.stringify(configFile.puzzles));
// let config = require('@colabo-utils/config');
import * as config from '@colabo-utils/config';
config.init(configFile);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
