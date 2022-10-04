import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    runTransaction,
    startAfter,
    Timestamp,
    where,
} from '@angular/fire/firestore';
import {
    DocumentData,
    DocumentReference,
    updateDoc,
} from '@firebase/firestore';
import { catchError, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../service/auth.service';
import { httpHandleErrorFactory } from '../utility/http';
import { Draw, drawDocToJsonData, DrawKey, DRAWS_KEY, USERS_KEY } from './draw';

export interface DrawList {
    draws: Draw[];
    reachEnd: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LuckyDrawService {
    constructor(
        private db: Firestore,
        private authService: AuthService,
        private httpClient: HttpClient
    ) {}

    getDrawById(drawId: string): Observable<Draw> {
        return from(this.getDrawByIdAsync(drawId));
    }

    async getDrawList(idStartAfter?: string): Promise<DrawList> {
        const draws = await this.getDraws(idStartAfter);
        if (draws.length === 0) return { reachEnd: true, draws };
        const nextDraw = await this.getDraws(draws[draws.length - 1].id, 1);
        return { draws, reachEnd: nextDraw.length === 0 };
    }

    createNewDraw(name: string): Observable<void> {
        return from(this.createNewDrawAsync(name));
    }

    deleteDraw(id: string): Observable<void> {
        return from(this.deleteDrawAsync(id));
    }

    resetDraw(id: string): Observable<void> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return this.httpClient
            .delete<void>(`${uid}/draw/${id}/reset`)
            .pipe(catchError(httpHandleErrorFactory));
    }

    getDrawDoc(drawId: string): DocumentReference<DocumentData> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return doc(this.db, USERS_KEY, uid, DRAWS_KEY, drawId);
    }

    async checkIfUserDocsExist(): Promise<boolean> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const docSnap = await getDoc(doc(this.db, USERS_KEY, uid));
        return docSnap.exists();
    }

    async getDrawByName(name: string): Promise<Draw | undefined> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const querySnapshot = await getDocs(
            query(
                collection(this.db, USERS_KEY, uid, DRAWS_KEY),
                where(DrawKey.name, '==', name),
                orderBy(DrawKey.name, 'desc'),
                limit(1)
            )
        );
        return querySnapshot.empty
            ? undefined
            : querySnapshot.docs.map((doc) => drawDocToJsonData(doc))[0];
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

    async getDraws(idStartAfter?: string, pageSize?: number): Promise<Draw[]> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const userDocExist = await this.checkIfUserDocsExist();
        if (!userDocExist) return [];

        const queryConstraints: QueryConstraint[] = [];
        if (idStartAfter) {
            const doc = await getDoc(this.getDrawDoc(idStartAfter));
            if (!doc.exists())
                throw new Error(`draw ${idStartAfter} does not exist`);
            queryConstraints.push(startAfter(doc));
        }
        const querySnapshot = await getDocs(
            query(
                collection(this.db, USERS_KEY, uid, DRAWS_KEY),
                ...[
                    orderBy(DrawKey.createdAt, 'desc'),
                    limit(pageSize ?? environment.production ? 10 : 1),
                    ...queryConstraints,
                ]
            )
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
