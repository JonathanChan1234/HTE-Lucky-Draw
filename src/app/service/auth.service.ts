import { Injectable, OnDestroy } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    Unsubscribe,
    updatePassword,
    User,
    UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable, shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    user$ = new BehaviorSubject<User | null>(null);
    authUnsubscribe: Unsubscribe;

    constructor(private auth: Auth) {
        this.authUnsubscribe = auth.onAuthStateChanged((user) => {
            this.user$.next(user);
        });
    }

    getUserId(): string | undefined {
        return this.user$.getValue()?.uid;
    }

    getUserInfo(): Promise<User | null> {
        return new Promise((resolve, reject) => {
            const unsubscribe = this.auth.onAuthStateChanged(
                (user) => {
                    unsubscribe();
                    resolve(user);
                },
                (error) => {
                    unsubscribe();
                    reject(error);
                }
            );
        });
    }

    getUserIdToken(): Promise<string> {
        if (!this.auth.currentUser) throw new Error('Not authenticated');
        return this.auth.currentUser.getIdToken();
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

    async changePassword(
        oldPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = this.user$.value;
        if (!user || !user.email) throw new Error('Unauthenticated');
        const credential = EmailAuthProvider.credential(
            user.email,
            oldPassword
        );
        await reauthenticateWithCredential(user, credential);
        return updatePassword(user, newPassword);
    }

    signOut(): Observable<void> {
        return from(signOut(this.auth));
    }

    ngOnDestroy(): void {
        this.authUnsubscribe();
    }
}
