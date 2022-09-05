import { Injectable } from '@angular/core';
import {
    doc,
    DocumentData,
    DocumentReference,
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
} from '@angular/fire/firestore';
import { collection, endBefore, limitToLast, where } from '@firebase/firestore';
import {
    Participant,
    ParticipantKey,
    PARTICIPANTS_KEY,
} from '../participant/participant';
import { ParticipantDbService } from '../participant/participant-db.service';
import { AuthService } from '../service/auth.service';
import { LuckyDrawService } from '../service/lucky-draw.service';
import { Prize, prizeDocToJsonObject, PrizeKey, PRIZES_KEY } from './prize';
import { CreatePrizeDao, EditPrizeDao } from './prize.action';
import { PrizePaginatorOption, PrizeSearchFilter } from './prize.reducer';

const USERS_KEY = 'users';
const DRAWS_KEY = 'draws';

export interface PrizeList {
    prizes: Prize[];
    reachStart: boolean;
    reachEnd: boolean;
}

export type UpdateParticipantPrizeDao = Pick<
    Participant,
    ParticipantKey.prize | ParticipantKey.prizeWinner | ParticipantKey.prizeId
>;

@Injectable({
    providedIn: 'root',
})
export class PrizeService {
    constructor(
        private db: Firestore,
        private authService: AuthService,
        private drawService: LuckyDrawService,
        private participantService: ParticipantDbService
    ) {}

    getPrizeRef(
        drawId: string,
        prizeId: string
    ): DocumentReference<DocumentData> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return doc(
            this.db,
            USERS_KEY,
            uid,
            DRAWS_KEY,
            drawId,
            PRIZES_KEY,
            prizeId
        );
    }

    async getLastSequence(drawId: string): Promise<number> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        const lastSequenceQuery = query(
            collection(this.db, USERS_KEY, uid, DRAWS_KEY, drawId, PRIZES_KEY),
            orderBy(PrizeKey.sequence, 'desc'),
            limit(1)
        );
        const prizes = await getDocs(lastSequenceQuery);
        if (prizes.empty) return 1;
        const prize = prizes.docs.at(0);
        return prize !== undefined ? prize.data()[PrizeKey.sequence] + 1 : 1;
    }

    async getPrizeList(
        drawId: string,
        pageSize: number,
        filter: PrizeSearchFilter,
        pageOption?: PrizePaginatorOption
    ): Promise<PrizeList> {
        const prizes = await this.getPrizes(
            drawId,
            pageSize,
            filter,
            pageOption
        );
        if (prizes.length === 0)
            return { prizes, reachStart: true, reachEnd: true };

        if (
            (pageOption && pageOption.type === 'startAfter') ||
            pageOption === undefined
        ) {
            const nextPrize = await this.getPrizes(drawId, 1, filter, {
                type: 'startAfter',
                id: prizes[prizes.length - 1].id,
            });

            return {
                prizes,
                reachStart: pageOption === undefined,
                reachEnd: nextPrize.length === 0,
            };
        }
        const nextPrize = await this.getPrizes(drawId, 1, filter, {
            type: 'endBefore',
            id: prizes[0].id,
        });
        return { prizes, reachStart: nextPrize.length === 0, reachEnd: false };
    }

    async getPrizes(
        drawId: string,
        pageSize: number,
        { assigned, searchValue }: PrizeSearchFilter,
        pageOption?: PrizePaginatorOption
    ): Promise<Prize[]> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');

        const queryConstraints: QueryConstraint[] = [];

        if (assigned !== undefined) {
            queryConstraints.push(where(PrizeKey.assigned, '==', assigned));
        }

        if (searchValue !== '') {
            queryConstraints.push(
                where(PrizeKey.name, '<=', searchValue + '\uf8ff'),
                where(PrizeKey.name, '>=', searchValue),
                orderBy(PrizeKey.name, 'desc')
            );
        }
        queryConstraints.push(orderBy(PrizeKey.sequence, 'desc'));

        if (pageOption && pageOption.type === 'startAfter') {
            const lastDoc = await getDoc(
                this.getPrizeRef(drawId, pageOption.id)
            );
            queryConstraints.push(startAfter(lastDoc), limit(pageSize));
        }

        if (pageOption && pageOption.type === 'endBefore') {
            const firstDoc = await getDoc(
                this.getPrizeRef(drawId, pageOption.id)
            );
            queryConstraints.push(endBefore(firstDoc), limitToLast(pageSize));
        }

        if (pageOption === undefined) queryConstraints.push(limit(pageSize));

        const getPrizeQuery = query(
            collection(this.db, USERS_KEY, uid, DRAWS_KEY, drawId, PRIZES_KEY),
            ...[...queryConstraints]
        );
        const documentSnapshots = await getDocs(getPrizeQuery);
        return documentSnapshots.docs.map((doc) => prizeDocToJsonObject(doc));
    }

    async checkIfPrizeSequenceExists(
        uid: string,
        drawId: string,
        sequence: number,
        prizeId?: string
    ): Promise<boolean> {
        const sequenceQuery = query(
            collection(this.db, USERS_KEY, uid, DRAWS_KEY, drawId, PRIZES_KEY),
            where(PrizeKey.sequence, '==', sequence),
            limit(1)
        );
        const docs = await getDocs(sequenceQuery);
        // return false if the found prize id is the same as prizeId
        if (prizeId && docs.docs[0].id === prizeId) return false;
        return !docs.empty;
    }

    // TODO: better change it to cloud function
    async createPrizes(
        drawId: string,
        prizes: CreatePrizeDao[]
    ): Promise<void> {
        if (prizes.length > 100)
            throw new Error('You can import at most 100 prizes at a time');

        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');

        // check the sequence
        for (const { sequence } of prizes) {
            if (await this.checkIfPrizeSequenceExists(uid, drawId, sequence))
                throw new Error('Prize sequence already exists');
        }
        return runTransaction(this.db, async (transaction) => {
            const drawRef = this.drawService.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            for (const { name, sequence, sponsor } of prizes) {
                const prizeRef = doc(
                    collection(
                        this.db,
                        USERS_KEY,
                        uid,
                        DRAWS_KEY,
                        drawId,
                        PRIZES_KEY
                    )
                );
                const prize: Omit<Prize, 'id'> = {
                    name,
                    sequence,
                    addedAt: Timestamp.now(),
                    assigned: false,
                    sponsor,
                };
                transaction.set(prizeRef, prize);
            }
            transaction.update(drawRef, {
                prizeCount: drawDoc.data()['prizeCount'] + prizes.length,
            });
        });
    }

    // TODO: Need to refactor
    async editPrize(
        drawId: string,
        { id, name, sponsor, sequence, winnerId }: EditPrizeDao
    ): Promise<void> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');

        return runTransaction(this.db, async (transaction) => {
            const prizeRef = this.getPrizeRef(drawId, id);
            const prizeDoc = await transaction.get(prizeRef);
            if (!prizeDoc.exists()) throw new Error('Prize does not exist');

            if (
                await this.checkIfPrizeSequenceExists(uid, drawId, sequence, id)
            )
                throw new Error('Prize sequence already exists');

            // Case 1: The original winner id and new winner id are the same, no need to change the winner status of both prize and participant
            // Case 2: The original winner id and new winner id aren't the same, need to change the prize status as well as the status of the original and new winner
            // Case 3: The prize is set to be not assigned. Need to update the status of the prize (not assigned) as well as the original winner (non-prize winner) if there is any
            // Exception Case 1: new winner id does not exist in the participant database
            // Exception Case 2: prize sequence already exists in the prize database

            const originalWinnerId = prizeDoc.data()[PrizeKey.winnerId];
            let prize: Partial<Prize> = { name, sequence, sponsor };
            // Case 2 and 3, reset the participant prize status and prize winner status if no winner is empty
            if (
                (originalWinnerId && !winnerId) ||
                (originalWinnerId && winnerId && winnerId !== originalWinnerId)
            ) {
                const oldWinnerRef = doc(
                    this.db,
                    USERS_KEY,
                    uid,
                    DRAWS_KEY,
                    drawId,
                    PARTICIPANTS_KEY,
                    originalWinnerId
                );
                const oldWinnerDoc = await transaction.get(oldWinnerRef);
                if (oldWinnerDoc.exists()) {
                    const oldWinnerPrizeStatus: UpdateParticipantPrizeDao = {
                        prize: '',
                        prizeId: '',
                        prizeWinner: false,
                    };
                    transaction.update(oldWinnerRef, oldWinnerPrizeStatus);
                }
                prize = { ...prize, assigned: false, winner: '', winnerId: '' };
            }

            // Case 2, apply when the prize already has a winner or not
            if (winnerId && winnerId !== originalWinnerId) {
                // update the new winner status
                const newWinnerRef = doc(
                    this.db,
                    USERS_KEY,
                    uid,
                    DRAWS_KEY,
                    drawId,
                    PARTICIPANTS_KEY,
                    winnerId
                );
                const newWinnerDoc = await transaction.get(newWinnerRef);
                if (!newWinnerDoc.exists())
                    throw new Error('Invalid Participant ID');
                if (newWinnerDoc.data()[ParticipantKey.prize] !== '')
                    throw new Error(
                        'Participant has already been assigned prize'
                    );
                const newWinnerPrizeStatus: UpdateParticipantPrizeDao = {
                    prize: name,
                    prizeId: id,
                    prizeWinner: true,
                };
                transaction.update(newWinnerRef, newWinnerPrizeStatus);
                prize = {
                    ...prize,
                    assigned: true,
                    winner: newWinnerDoc.data()[ParticipantKey.name],
                    winnerId: winnerId,
                };
            }

            transaction.update(prizeRef, prize);
        });
    }

    async deletePrize(drawId: string, prizeId: string) {
        return runTransaction(this.db, async (transaction) => {
            const drawRef = this.drawService.getDrawDoc(drawId);
            const drawDoc = await transaction.get(drawRef);
            if (!drawDoc.exists()) throw new Error('Draw does not exist');

            const prizeRef = this.getPrizeRef(drawId, prizeId);
            const prizeDoc = await transaction.get(prizeRef);
            if (!prizeDoc.exists()) throw new Error('Prize does not exist');

            if (prizeDoc.data()[PrizeKey.assigned]) {
                const participantRef =
                    this.participantService.getParticipantRef(
                        drawId,
                        prizeDoc.data()[PrizeKey.winnerId]
                    );
                const participantDoc = await transaction.get(participantRef);
                if (participantDoc.exists()) {
                    const updatedProps: UpdateParticipantPrizeDao = {
                        prize: '',
                        prizeId: '',
                        prizeWinner: false,
                    };
                    transaction.update(participantRef, updatedProps);
                }
            }

            transaction.delete(prizeRef);
            transaction.update(drawRef, {
                prizeCount: drawDoc.data()['prizeCount'] - 1,
            });
        });
    }
}
