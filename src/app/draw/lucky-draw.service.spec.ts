import { TestBed } from '@angular/core/testing';

import { LuckyDrawService } from './lucky-draw.service';

describe('LuckyDrawService', () => {
    let service: LuckyDrawService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LuckyDrawService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
