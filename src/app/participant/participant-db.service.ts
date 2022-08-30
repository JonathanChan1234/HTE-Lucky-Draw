import { Injectable } from '@angular/core';
import {
    collection,
    doc,
    DocumentData,
    DocumentReference,
    endBefore,
    Firestore,
    getDocs,
    limit,
    limitToLast,
    orderBy,
    query,
    QueryConstraint,
    runTransaction,
    startAfter,
    Timestamp,
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
            queryConstraints.push(where(searchField, '<=', searchValue));
            queryConstraints.push(
                where(searchField, '>=', searchValue + '\uf8ff')
            );
            queryConstraints.push(orderBy(searchField));
        }
        queryConstraints.push(orderBy('id'));
        if (pageOption) {
            if (pageOption.type === 'startAfter') {
                queryConstraints.push(
                    startAfter(pageOption.id),
                    limit(pageSize)
                );
            } else {
                queryConstraints.push(
                    endBefore(pageOption.id),
                    limitToLast(pageSize)
                );
            }
        } else {
            queryConstraints.push(limit(pageSize));
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
            ...[...queryConstraints]
        );
        const documentSnapshots = await getDocs(getParticipantQuery);

        return documentSnapshots.docs.map((doc) => ToJSONObject(doc));
    }

    async editParticipant(
        drawId: string,
        participant: Pick<Participant, 'id' | 'name' | 'message' | 'signedIn'>
    ): Promise<void> {
        return runTransaction(this.db, async (transaction) => {
            const drawRef = this.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            const participantRef = this.getParticipantDoc(
                drawId,
                participant.id
            );
            const participantDoc = await transaction.get(participantRef);
            if (!participantDoc.exists())
                throw new Error('Participant does not exist!');

            // Check if there the participant is already signed in or not
            const model = ToJSONObject(participantDoc);

            // The participant is from "signed in" to "not signed in"
            if (model.signedIn && !participant.signedIn) {
                transaction.update(drawRef, {
                    signInCount: drawDoc.data()['signInCount'] - 1,
                });
            }

            // The participant is from "not signed in" to "signed in"
            if (!model.signedIn && participant.signedIn) {
                transaction.update(drawRef, {
                    signInCount: drawDoc.data()['signInCount'] + 1,
                });
            }
            transaction.update(participantRef, participant);
        });
    }

    async deleteParticipant(
        drawId: string,
        participantId: string
    ): Promise<void> {
        return runTransaction(this.db, async (transaction) => {
            const drawRef = this.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            const participantRef = this.getParticipantDoc(
                drawId,
                participantId
            );
            const participantDoc = await transaction.get(participantRef);
            if (!participantDoc.exists())
                throw new Error('Participant does not exist!');

            // Check if there the participant is already signed in or not
            const participant = ToJSONObject(participantDoc);
            if (participant.signedIn) {
                transaction.update(drawRef, {
                    signInCount: drawDoc.data()['signInCount'] - 1,
                });
            }

            transaction.update(drawRef, {
                participantCount: drawDoc.data()['participantCount'] - 1,
            });
            transaction.delete(participantRef);
        });
    }

    async createParticipant(
        drawId: string,
        participants: Pick<
            Participant,
            'id' | 'name' | 'message' | 'signedIn'
        >[]
    ): Promise<void> {
        if (participants.length > 100)
            throw new Error(
                'You can import at most 100 participants at a time'
            );
        return runTransaction(this.db, async (transaction) => {
            const drawRef = this.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            let signedInCount = 0;
            for (const { id } of participants) {
                const participantDoc = await transaction.get(
                    this.getParticipantDoc(drawId, id)
                );
                if (participantDoc.exists())
                    throw new Error(`Participant ID ${id} already exists`);
            }
            for (const { id, name, message, signedIn } of participants) {
                const participantRef = this.getParticipantDoc(drawId, id);
                const participant: Participant = {
                    id,
                    name,
                    message,
                    signedIn,
                    signedInAt: Timestamp.now(),
                    prize: '',
                    prizeId: '',
                    prizeWinner: false,
                    random: Math.round(Math.random() * (Math.pow(2, 32) - 1)),
                };
                if (signedIn) signedInCount++;
                transaction.set(participantRef, participant);
            }

            transaction.update(drawRef, {
                participantCount: drawDoc.data()['participantCount'] + 1,
                signInCount: drawDoc.data()['signInCount'] + signedInCount,
            });
        });
    }

    getDrawDoc(drawId: string): DocumentReference<DocumentData> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return doc(this.db, USERS_KEY, uid, DRAWS_KEY, drawId);
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
