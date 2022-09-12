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
    Timestamp,
    where,
} from '@angular/fire/firestore';
import {
    DocumentData,
    DocumentReference,
    updateDoc,
} from '@firebase/firestore';
import { from, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Draw, drawDocToJsonData, DrawKey, DRAWS_KEY, USERS_KEY } from './draw';

@Injectable({
    providedIn: 'root',
})
export class LuckyDrawService {
    constructor(private db: Firestore, private authService: AuthService) {}

    getDrawById(drawId: string): Observable<Draw> {
        return from(this.getDrawByIdAsync(drawId));
    }

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
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const docSnap = await getDoc(doc(this.db, USERS_KEY, uid));
        return docSnap.exists();
    }

    getDrawDoc(drawId: string): DocumentReference<DocumentData> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return doc(this.db, USERS_KEY, uid, DRAWS_KEY, drawId);
    }

    async getDrawRefById(
        drawId: string
    ): Promise<DocumentReference<DocumentData>> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const drawDoc = doc(this.db, USERS_KEY, uid, DRAWS_KEY, drawId);

        // check if the doc exists
        const drawRef = await getDoc(drawDoc);
        if (!drawRef.exists()) throw new Error('This draw does not exist');
        return drawDoc;
    }

    async getDrawByIdAsync(drawId: string): Promise<Draw> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const drawDoc = await getDoc(
            doc(this.db, USERS_KEY, uid, DRAWS_KEY, drawId)
        );
        if (!drawDoc.exists())
            throw new Error(`Draw doc ${drawId} does not exist`);
        return drawDocToJsonData(drawDoc);
    }

    async getDrawListAsync(): Promise<Draw[]> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const userDocExist = await this.checkIfUserDocsExist();
        if (!userDocExist) return [];

        const querySnapshot = await getDocs(
            collection(this.db, USERS_KEY, uid, DRAWS_KEY)
        );
        return querySnapshot.docs.map((doc) => drawDocToJsonData(doc));
    }

    async createNewDrawAsync(name: string): Promise<void> {
        return this.createDraw({
            name,
            lock: false,
            participantCount: 0,
            prizeCount: 0,
            signInCount: 0,
            signInRequired: true,
            createdAt: Timestamp.now(),
        });
    }

    async createDraw(draw: Omit<Draw, 'id'>): Promise<void> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');

        const drawQuery = query(
            collection(this.db, USERS_KEY, uid, DRAWS_KEY),
            where(DrawKey.name, '==', draw.name)
        );
        const drawDocs = await getDocs(drawQuery);
        if (!drawDocs.empty)
            throw new Error(
                `The draw name ${draw.name} already exists. Please choose another name`
            );
        await runTransaction(this.db, async (transaction) => {
            // check if the user doc exists, create the user docs first if not
            const userDoc = await transaction.get(doc(this.db, USERS_KEY, uid));
            if (!userDoc.exists()) {
                transaction.set(doc(this.db, USERS_KEY, uid), {
                    uid,
                });
            }
            transaction.set(
                doc(collection(this.db, USERS_KEY, uid, DRAWS_KEY)),
                draw
            );
        });
    }

    async updateDrawNameAsync(drawId: string, name: string): Promise<void> {
        const drawRef = await this.getDrawRefById(drawId);
        return updateDoc(drawRef, { [DrawKey.name]: name });
    }

    async updateSignInRequiredAsync(
        drawId: string,
        signInRequired: boolean
    ): Promise<void> {
        const drawRef = await this.getDrawRefById(drawId);
        return updateDoc(drawRef, { [DrawKey.signInRequired]: signInRequired });
    }

    async updateLockAsync(drawId: string, lock: boolean): Promise<void> {
        const drawRef = await this.getDrawRefById(drawId);
        return updateDoc(drawRef, { [DrawKey.lock]: lock });
    }

    async deleteDrawAsync(drawId: string): Promise<void> {
        const drawRef = await this.getDrawRefById(drawId);
        return deleteDoc(drawRef);
    }
}
