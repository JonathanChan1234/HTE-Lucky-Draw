import { Injectable } from '@angular/core';
import {
    collection,
    doc,
    DocumentData,
    DocumentReference,
    endBefore,
    Firestore,
    getDoc,
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
import { DRAWS_KEY, USERS_KEY } from '../draw/draw';
import { LuckyDrawService } from '../draw/lucky-draw.service';
import { Prize, PrizeKey, PRIZES_KEY } from '../prize/prize';
import { AuthService } from '../service/auth.service';
import {
    Participant,
    participantDocToJsonObject,
    ParticipantKey,
    PARTICIPANTS_KEY,
} from './participant';
import { ParticipantSearchFilter } from './participant.reducer';

export interface ParticipantList {
    participants: Participant[];
    reachStart: boolean;
    reachEnd: boolean;
}

export type ParticipantPaginatorOption = {
    id: string;
    type: 'startAfter' | 'endBefore';
};

@Injectable({
    providedIn: 'root',
})
export class ParticipantDbService {
    constructor(
        private db: Firestore,
        private authService: AuthService,
        private luckyDrawService: LuckyDrawService
    ) {}

    async getParticpantData(
        drawId: string,
        pageSize: number,
        filter: ParticipantSearchFilter,
        pageOption?: ParticipantPaginatorOption
    ): Promise<ParticipantList> {
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
                reachStart: pageOption === undefined,
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
        if (!uid) throw new Error('Not signed in');

        const queryConstraints: QueryConstraint[] = [];

        if (prizeWinner !== undefined) {
            queryConstraints.push(
                where(ParticipantKey.prizeWinner, '==', prizeWinner)
            );
        }

        if (signedIn !== undefined) {
            queryConstraints.push(
                where(ParticipantKey.signedIn, '==', signedIn)
            );
        }

        if (searchValue !== '') {
            queryConstraints.push(
                where(searchField, '<=', searchValue + '\uf8ff'),
                where(searchField, '>=', searchValue)
            );
        }

        if (searchField === 'id')
            queryConstraints.push(orderBy('id'), orderBy('name'));
        else queryConstraints.push(orderBy('name'), orderBy('id'));

        if (pageOption && pageOption.type === 'startAfter') {
            const lastDoc = await getDoc(
                this.getParticipantRef(drawId, pageOption.id)
            );
            queryConstraints.push(startAfter(lastDoc), limit(pageSize));
        }

        if (pageOption && pageOption.type === 'endBefore') {
            const firstDoc = await getDoc(
                this.getParticipantRef(drawId, pageOption.id)
            );
            queryConstraints.push(endBefore(firstDoc), limitToLast(pageSize));
        }

        if (pageOption === undefined) queryConstraints.push(limit(pageSize));

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

        return documentSnapshots.docs.map((doc) =>
            participantDocToJsonObject(doc)
        );
    }

    async editParticipant(
        drawId: string,
        participant: Pick<Participant, 'id' | 'name' | 'message' | 'signedIn'>
    ): Promise<void> {
        return runTransaction(this.db, async (transaction) => {
            const drawRef = this.luckyDrawService.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            const participantRef = this.getParticipantRef(
                drawId,
                participant.id
            );
            const participantDoc = await transaction.get(participantRef);
            if (!participantDoc.exists())
                throw new Error('Participant does not exist!');

            // Check if there the participant is already signed in or not
            const model = participantDocToJsonObject(participantDoc);

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
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return runTransaction(this.db, async (transaction) => {
            const drawRef = this.luckyDrawService.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            const participantRef = this.getParticipantRef(
                drawId,
                participantId
            );
            const participantDoc = await transaction.get(participantRef);
            if (!participantDoc.exists())
                throw new Error('Participant does not exist!');

            // Check if there the participant is already signed in or not
            const participant = participantDocToJsonObject(participantDoc);
            if (participant.prizeWinner && participant.prizeId !== '') {
                const prizeRef = doc(
                    this.db,
                    USERS_KEY,
                    uid,
                    DRAWS_KEY,
                    drawId,
                    PRIZES_KEY,
                    participant.prizeId
                );
                const prizeDoc = await transaction.get(prizeRef);
                const prize: Pick<
                    Prize,
                    PrizeKey.assigned | PrizeKey.winner | PrizeKey.winnerId
                > = { assigned: false, winner: '', winnerId: '' };
                if (prizeDoc.exists()) {
                    transaction.update(prizeRef, prize);
                }
            }

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
            const drawRef = this.luckyDrawService.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            let signedInCount = 0;
            for (const { id } of participants) {
                const participantDoc = await transaction.get(
                    this.getParticipantRef(drawId, id)
                );
                if (participantDoc.exists())
                    throw new Error(`Participant ID ${id} already exists`);
            }
            for (const { id, name, message, signedIn } of participants) {
                const u = new Int32Array(1);
                const random = crypto.getRandomValues(u);
                const participantRef = this.getParticipantRef(drawId, id);
                const participant: Participant = {
                    id,
                    name,
                    message,
                    signedIn,
                    signedInAt: Timestamp.now(),
                    prize: '',
                    prizeId: '',
                    prizeWinner: false,
                    random: random[0],
                };
                if (signedIn) signedInCount++;
                transaction.set(participantRef, participant);
            }

            transaction.update(drawRef, {
                participantCount:
                    drawDoc.data()['participantCount'] + participants.length,
                signInCount: drawDoc.data()['signInCount'] + signedInCount,
            });
        });
    }

    getParticipantRef(
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
