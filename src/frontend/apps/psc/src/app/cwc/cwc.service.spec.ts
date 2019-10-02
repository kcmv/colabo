import { TestBed, inject } from '@angular/core/testing';

import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
import {KnalledgeMapService} from '@colabo-knalledge/f-store_core/knalledge-map.service';

import { CWCService } from './cwc.service';

describe('CWCService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CWCService, KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapService]
    });
  });

  it('should be created', inject([CWCService, KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapService], (service: CWCService) => {
    expect(service).toBeTruthy();
  }));
});
