# Procedure

## 1. Create a frontend puzzle

See in the [Example](colabo/src/tools/EXAMPLES.md) an example for the `@colabo-flow/f-audit` puzzle creation, by `colabo` CLI tools.

## 2. Integrate in the frontend

Integrate it as a dependency and an offering in the `colabo/src/frontend/colabo.config.js`
    + then `yarn` it (in `colabo/src/frontend`)

## 3. Integrate in the frontend app

Integrate it as a dependency in the `colabo/src/frontend/apps/psc/colabo.config.js`
    + then `yarn` it (in `colabo/src/frontend/apps/psc/`)

## 4. Add params.ts

```ts
export const MODULE_NAME: string = "@colabo-flow/f-audit";
```

## 5. Add puzzle's module

In `colabo/src/frontend/dev_puzzles/flow/audit/lib/module.ts`:

```ts
import {MODULE_NAME} from './params';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { MaterialModule } from './materialModule';

import {ReactiveFormsModule} from "@angular/forms"; //for the 'Reactive Forms' i.e. 'Model Driven Forms'

import { ColaboFlowAuditService } from './colabo-flow-audit.service';
import { ColaboFlowAuditForm } from './audit-form/audit-form.component';

var moduleDeclarations:any[] = [
    ColaboFlowAuditForm
];

var moduleImports: any[] = [
    RouterModule,

    ReactiveFormsModule,

    FormsModule,
    FlexLayoutModule,

    // Material
    BrowserAnimationsModule,
    MaterialModule,

];

@NgModule({
    declarations: moduleDeclarations,
    imports: moduleImports,
    // exports: moduleImports.concat(moduleDeclarations)
    exports: moduleDeclarations,
    providers: [
        ColaboFlowAuditService
    ]
})
export class ColaboFlowAuditModule { }
```

## 6. Add Service

In `colabo/src/frontend/dev_puzzles/flow/audit/lib/colabo-flow-audit.service.ts`:

```ts
const MODULE_NAME: string = "@colabo-flow/f-audit";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ColaboFlowAuditService{

  protected _isActive:boolean = true;

  constructor(
    ) {
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
    if(!this._isActive) return;

    // initialize 
  }
  
  getItems():any[]{
    let items:any[] = [];
    items.push({
      id: "ff3c",
      name: "Сава"
    });
    items.push({
      id: "ad3c",
      name: "Николај"
    });
    items.push({
      id: "872е",
      name: "Симеон"
    });
    return items;
  }
}
```

## 6. Add materialModule

## Add index.ts

In `colabo/src/frontend/dev_puzzles/flow/audit/index.ts`:

```ts
export { MODULE_NAME } from './lib/params';
export { ColaboFlowAuditForm } from './lib/audit-form/audit-form.component';
export { ColaboFlowAuditModule } from './lib/module';
```

## 7. Add component

In `colabo/src/frontend/dev_puzzles/flow/audit/lib/audit-form/audit-form.component.html` add:

```html
<div fxLayout="column" fxFlexFill style="height: 100%;">

    <!-- toolbar -->
    <div fxFlex="64px" style="overflow-y: hidden;">
        <mat-toolbar class="toolbar flexible mat-theme-indigo" color="primary" style="width: 100%;">
            <img src="/assets/images/colabo-logo-url-square.jpg" height="55px" style="margin-right: 7px; opacity: 0.9; border-radius: 7px;" />
            <button mat-mini-fab mat-tooltip="Home" tooltip-position="below" class="mat-mini mat-primary" aria-label="Home" routerLink="/" style="margin-right: 5px;">
                <mat-icon [ngClass]="{warning: false}" title="Home">home</mat-icon>
            </button>ColaboFlow - Audit
        </mat-toolbar>
    </div>

    <div fxFlex id="scrolling_content" style="/*background-color: yellow;*/ overflow-y:scroll; margin: 15px;">
        <div class="chat-list">
            <div *ngFor="let item of items">
                <p>
                    <mat-icon [style.display]="item?.id ? 'inline' : 'none' ">done</mat-icon>
                    <span *ngIf="item.id" style="font-weight: bold; color: blue">
                    {{item?.id}}:  &nbsp;
                    </span>
                    <span> {{item?.name}} </span>
                </p>
            </div>
        </div>
    </div>
</div>
```

In `colabo/src/frontend/dev_puzzles/flow/audit/lib/audit-form/audit-form.component.ts` add:

```ts
import {MODULE_NAME} from '../params';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ColaboFlowAuditService } from '../colabo-flow-audit.service';

import { GetPuzzle } from '@colabo-utils/i-config';

// https://www.npmjs.com/package/uuid
import * as uuidv1 from 'uuid/v1';

@Component({
  selector: 'colabo-flow-audit-form',
  templateUrl: './audit-form.component.html',
  styleUrls: ['./audit-form.component.css']
})

export class ColaboFlowAuditForm implements OnInit {
  public items: any[];
  protected puzzleConfig: any;

  constructor(
    private colaboFlowAuditService: ColaboFlowAuditService,
  ) {
  }

  ngOnInit() {
    this.puzzleConfig = GetPuzzle(MODULE_NAME);
    this.items = this.colaboFlowAuditService.getItems();
  }
}
```

## 8. Export from index.ts

In `colabo/src/frontend/dev_puzzles/flow/audit/index.ts`:

```ts
export { ColaboFlowAuditForm } from './lib/audit-form/audit-form.component';
export { ColaboFlowAuditModule } from './lib/module';
```

## 8. Extend app

In `` add a new route:

```ts
// ...
import { ColaboFlowAuditForm } from '@colabo-flow/f-audit';
// ...
const routes: Routes = [
  // ...
  {
    path: 'colaboflow-audits',
    component: ColaboFlowAuditForm
  }
  // ...
];
```

In `colabo/src/frontend/apps/psc/src/app/app.module.ts` add puzzle's module:

```ts
//...
import { ColaboFlowAuditModule } from '@colabo-flow/f-audit';
//...
var moduleImports = [
    // ...
    , ColaboFlowAuditModule
    // ...
];
```

add button to the route

In `colabo/src/frontend/dev_puzzles/moderation/core/moderation-panel/moderation-panel.component.html`:

```html
    <p>
        <a routerLink="/colaboflow-audits">
            <button mat-raised-button color="primary" style="width: 75%; max-width: 500px;">ColaboFlow Audits</button>
        </a>
    </p>
```