import { TestBed } from '@angular/core/testing';

import { ParticipantDbService } from './participant-db.service';

describe('ParticipantDbService', () => {
  let service: ParticipantDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
