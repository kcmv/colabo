import {MODULE_NAME} from '../params';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ColaboFlowAuditService } from '../colabo-flow-audit.service';

import { GetPuzzle } from '@colabo-utils/i-config';
import { AuditedAction } from '@colabo-flow/i-audit';

// https://www.npmjs.com/package/uuid
import * as uuidv1 from 'uuid/v1';

@Component({
  selector: 'colabo-flow-audit-form',
  templateUrl: './audit-form.component.html',
  styleUrls: ['./audit-form.component.css']
})

export class ColaboFlowAuditForm implements OnInit {
  public items: AuditedAction[];
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
