import { TestBed } from '@angular/core/testing';

import { DrawMainService } from './draw-main.service';

describe('DrawMainService', () => {
  let service: DrawMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
