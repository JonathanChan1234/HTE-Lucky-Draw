import { TestBed } from '@angular/core/testing';

import { ScreenSizeService } from './screen-size.service';

describe('ScreensizeService', () => {
    let service: ScreenSizeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ScreenSizeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
