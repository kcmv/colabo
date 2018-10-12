import { TestBed, inject } from '@angular/core/testing';

import { DialoGameService } from './dialo-game.service';

describe('DialoGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialoGameService]
    });
  });

  it('should be created', inject([DialoGameService], (service: DialoGameService) => {
    expect(service).toBeTruthy();
  }));
});
