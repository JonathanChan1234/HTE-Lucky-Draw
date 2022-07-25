import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

import { FirebaseAuthPrivateGuard } from './firebase-auth-private.guard';

describe('FirebaseLoginGuard', () => {
    let guard: FirebaseAuthPrivateGuard;
    let spyAuthService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        spyAuthService = jasmine.createSpyObj<AuthService>('authService', [
            'getUserInfo',
        ]);
        router = jasmine.createSpyObj<Router>('router', ['parseUrl']);
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: spyAuthService,
                },
                {
                    provide: Router,
                    useValue: router,
                },
            ],
        });
        guard = TestBed.inject(FirebaseAuthPrivateGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});
