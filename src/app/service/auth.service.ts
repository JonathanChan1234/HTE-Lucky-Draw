import { Injectable, OnDestroy } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    Unsubscribe,
    User,
    UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable, shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    auth$ = new BehaviorSubject<User | null>(null);
    authSubscription: Unsubscribe;

    constructor(private auth: Auth) {
        this.authSubscription = auth.onAuthStateChanged((user) => {
            this.auth$.next(user);
        });
    }

    register(email: string, password: string): Observable<UserCredential> {
        return from(
            createUserWithEmailAndPassword(this.auth, email, password)
        ).pipe(shareReplay(1));
    }

    signIn(email: string, password: string): Observable<UserCredential> {
        return from(
            signInWithEmailAndPassword(this.auth, email, password)
        ).pipe(shareReplay(1));
    }

    signOut() {
        return this.auth.signOut();
    }

    ngOnDestroy(): void {
        this.authSubscription();
    }
}
