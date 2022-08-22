import { Injectable } from '@angular/core';
import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    DocumentReference,
    endBefore,
    Firestore,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    startAfter,
    updateDoc,
} from '@angular/fire/firestore';
import { where } from '@firebase/firestore';
import { AuthService } from '../service/auth.service';
import { Participant, ToJSONObject } from './participant';
import { ParticipantSearchFilter } from './participant.reducer';

export interface ParticipantData {
    participants: Participant[];
    reachStart: boolean;
    reachEnd: boolean;
}

export type ParticipantPaginatorOption = {
    id: string;
    type: 'startAfter' | 'endBefore';
};

export const USERS_KEY = 'users';
export const DRAWS_KEY = 'draws';
export const PARTICIPANTS_KEY = 'participants';

@Injectable({
    providedIn: 'root',
})
export class ParticipantDbService {
    constructor(private db: Firestore, private authService: AuthService) {}

    async getParticpantData(
        drawId: string,
        pageSize: number,
        filter: ParticipantSearchFilter,
        pageOption?: ParticipantPaginatorOption
    ): Promise<ParticipantData> {
        console.log('get participant from db');
        const participants = await this.getParticipants(
            drawId,
            pageSize,
            filter,
            pageOption
        );

        if (participants.length === 0)
            return { participants, reachStart: true, reachEnd: true };

        // For first load or next page operation, check if there is next item
        if ((pageOption && pageOption.type === 'startAfter') || !pageOption) {
            const nextParticipant = await this.getParticipants(
                drawId,
                1,
                filter,
                {
                    type: 'startAfter',
                    id: participants[participants.length - 1].id,
                }
            );
            return {
                participants,
                reachStart: pageOption ? false : true,
                reachEnd: nextParticipant.length === 0,
            };
        }

        // For previous page operation, check if there is previous item
        const nextParticipant = await this.getParticipants(drawId, 1, filter, {
            type: 'endBefore',
            id: participants[0].id,
        });
        return {
            participants,
            reachEnd: false,
            reachStart: nextParticipant.length === 0,
        };
    }

    async getParticipants(
        drawId: string,
        pageSize: number,
        {
            prizeWinner,
            signedIn,
            searchValue,
            searchField,
        }: ParticipantSearchFilter,
        pageOption?: ParticipantPaginatorOption
    ): Promise<Participant[]> {
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
            collection(
                this.db,
                USERS_KEY,
                uid,
                DRAWS_KEY,
                drawId,
                PARTICIPANTS_KEY
            ),
            ...[...queryConstraints, limit(pageSize)]
        );
        const documentSnapshots = await getDocs(getParticipantQuery);

        return documentSnapshots.docs.map((doc) => ToJSONObject(doc));
    }

    async editParticipant(
        drawId: string,
        participant: Pick<Participant, 'id' | 'name' | 'message' | 'signedIn'>
    ): Promise<void> {
        return updateDoc(
            this.getParticipantDoc(drawId, participant.id),
            participant
        );
    }

    async deleteParticipant(
        drawId: string,
        participantId: string
    ): Promise<void> {
        return deleteDoc(this.getParticipantDoc(drawId, participantId));
    }

    getParticipantDoc(
        drawId: string,
        participantId: string
    ): DocumentReference<DocumentData> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return doc(
            this.db,
            USERS_KEY,
            uid,
            DRAWS_KEY,
            drawId,
            PARTICIPANTS_KEY,
            participantId
        );
    }
}
