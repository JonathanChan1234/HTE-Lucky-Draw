import { Injectable } from '@angular/core';
import {
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    query,
    runTransaction,
    where,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Draw } from '../model/draw';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class LuckyDrawService {
    constructor(
        private firestore: Firestore,
        private authService: AuthService
    ) {}

    getDrawList(): Observable<Draw[]> {
        return from(this.getDrawListAsync());
    }

    createNewDraw(name: string): Observable<void> {
        return from(this.createNewDrawAsync(name));
    }

    deleteDraw(id: string): Observable<void> {
        return from(this.deleteDrawAsync(id));
    }

    async checkIfUserDocsExist(): Promise<boolean> {
        if (!this.authService.user) throw new Error('Not authenticated');
        const docSnap = await getDoc(
            doc(this.firestore, `users`, this.authService.user.uid)
        );
        return docSnap.exists();
    }

    async getDrawListAsync(): Promise<Draw[]> {
        if (!this.authService.user) throw new Error('Not authenticated');
        const userDocExist = await this.checkIfUserDocsExist();
        if (!userDocExist) return [];

        const uid = this.authService.user.uid;
        const querySnapshot = await getDocs(
            collection(this.firestore, 'users', uid, 'draws')
        );
        const drawDocs: Draw[] = [];

        querySnapshot.forEach((doc) => {
            drawDocs.push(Draw.ToJSONObject(doc));
        });
        return drawDocs;
    }

    async createNewDrawAsync(name: string): Promise<void> {
        return this.createDraw(new Draw(name));
    }

    async createDraw(draw: Draw): Promise<void> {
        if (!this.authService.user) throw new Error('Not authenticated');
        const uid = this.authService.user.uid;

        const drawQuery = query(
            collection(this.firestore, 'users', uid, 'draws'),
            where('name', '==', draw.name)
        );
        const drawDocs = await getDocs(drawQuery);
        if (!drawDocs.empty)
            throw new Error(
                `The draw name ${draw.name} already exists. Please choose another name`
            );
        await runTransaction(this.firestore, async (transaction) => {
            // check if the user doc exists, create the user docs first if not
            const userDoc = await transaction.get(
                doc(this.firestore, 'users', uid)
            );
            if (!userDoc.exists()) {
                transaction.set(doc(this.firestore, 'users', uid), {
                    uid,
                });
            }
            transaction.set(
                doc(collection(this.firestore, 'users', uid, 'draws')),
                draw.toFirebaseData()
            );
        });
    }

    async deleteDrawAsync(id: string): Promise<void> {
        if (!this.authService.user) throw new Error('Not authenticated');
        const uid = this.authService.user.uid;
        const drawDoc = doc(this.firestore, 'users', uid, 'draws', id);

        // check if the doc exists
        const drawRef = await getDoc(drawDoc);
        if (!drawRef.exists()) throw new Error('This draw does not exist');

        return deleteDoc(drawDoc);
    }
}
