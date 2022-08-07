import { Injectable } from '@angular/core';
import {
    collection,
    endBefore,
    Firestore,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    startAfter,
} from '@angular/fire/firestore';
import { where } from '@firebase/firestore';
import { AuthService } from '../service/auth.service';
import { Participant, ToJSONObject } from './participant';
import {
    ParticipantPageOption,
    ParticipantSearchFilter,
} from './participant.service';

@Injectable({
    providedIn: 'root',
})
export class ParticipantDbService {
    constructor(private db: Firestore, private authService: AuthService) {}

    async getParticipants(
        drawId: string,
        pageSize: number,
        {
            prizeWinner,
            signedIn,
            searchValue,
            searchField,
        }: ParticipantSearchFilter,
        pageOption?: ParticipantPageOption
    ): Promise<Participant[]> {
        console.log('get participant from db');

        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not authenticated');
        const queryConstraints: QueryConstraint[] = [];
        if (prizeWinner !== undefined) {
            queryConstraints.push(where('prizeWinner', '==', prizeWinner));
        }
        if (signedIn !== undefined) {
            queryConstraints.push(where('signedIn', '==', signedIn));
        }
        if (searchValue !== '') {
            queryConstraints.push(
                where(searchField === 'id' ? 'id' : 'name', '<=', searchValue)
            );
            queryConstraints.push(
                where(searchField === 'id' ? 'id' : 'name', '>=', searchValue)
            );
            queryConstraints.push(orderBy(searchField));
        } else {
            queryConstraints.push(orderBy('id'));
        }
        if (pageOption) {
            queryConstraints.push(
                pageOption.type === 'startAfter'
                    ? startAfter(pageOption.id)
                    : endBefore(pageOption.id)
            );
        }

        const getParticipantQuery = query(
            collection(this.db, 'users', uid, 'draws', drawId, 'participants'),
            ...[...queryConstraints, limit(pageSize)]
        );
        const documentSnapshots = await getDocs(getParticipantQuery);

        return documentSnapshots.docs.map((doc) => ToJSONObject(doc));
    }
}
