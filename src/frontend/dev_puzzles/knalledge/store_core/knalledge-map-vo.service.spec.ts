import { TestBed, inject } from '@angular/core/testing';

import { KnalledgeMapVoService } from './knalledge-map-vo.service';

/*
TODO:
this is commented so far, because it's causing this class causes errors:
ERROR in node_modules/@colabo-knalledge/f-store_core/cf.service.spec.ts(5,1): error TS2304: Cannot find name 'describe'.
node_modules/@colabo-knalledge/f-store_core/cf.service.spec.ts(6,3): error TS2304: Cannot find name 'beforeEach'.
node_modules/@colabo-knalledge/f-store_core/cf.service.spec.ts(12,3): error TS2304: Cannot find name 'it'.
node_modules/@colabo-knalledge/f-store_core/cf.service.spec.ts(13,5): error TS2304: Cannot find name 'expect'.

Maybe it's because of naming (the CLI generated the class  'CfService' that I renamed to CFService)

More about the errors:
//https://github.com/angular/angular-cli/issues/7332
https://github.com/angular/angular-cli/issues/7341
https://github.com/angular/angular-cli/issues/8243
https://stackoverflow.com/questions/39020022/angular-2-unit-tests-cannot-find-name-describe

describe('KnalledgeMapVoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KnalledgeMapVoService]
    });
  });

  it('should be created', inject([KnalledgeMapVoService], (service: KnalledgeMapVoService) => {
    expect(service).toBeTruthy();
  }));
});

*/
