import { TestBed } from '@angular/core/testing';

import { FirebaseLoginGuard } from './firebase-login.guard';

describe('FirebaseLoginGuard', () => {
    let guard: FirebaseLoginGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        guard = TestBed.inject(FirebaseLoginGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});
