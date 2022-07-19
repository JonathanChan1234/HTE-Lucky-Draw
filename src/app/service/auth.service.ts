import { Injectable, OnDestroy } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    Unsubscribe,
    User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    auth$ = new BehaviorSubject<User | null>(null);
    authSubscription: Unsubscribe;

    constructor(private auth: Auth, private router: Router) {
        this.authSubscription = auth.onAuthStateChanged((user) => {
            this.auth$.next(user);
        });
    }

    async register(email: string, password: string) {
        await createUserWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['main']);
    }

    async signIn(email: string, password: string) {
        await signInWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['main']);
    }

    async signout() {
        await this.auth.signOut();
    }

    ngOnDestroy(): void {
        this.authSubscription();
    }
}
