import { Injectable } from '@angular/core';
import {
    doc,
    DocumentData,
    DocumentReference,
    Firestore,
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
import { omit } from 'lodash';
import { Participant, ParticipantKey } from '../participant/participant';
import { ParticipantDbService } from '../participant/participant-db.service';
import { AuthService } from '../service/auth.service';
import { LuckyDrawService } from '../service/lucky-draw.service';
import { Prize, prizeDocToJsonObject, PrizeKey, PRIZES_KEY } from './prize';
import { PrizePaginatorOption, PrizeSearchFilter } from './prize.reducer';

const USERS_KEY = 'users';
const DRAWS_KEY = 'draws';

export interface PrizeList {
    prizes: Prize[];
    reachStart: boolean;
    reachEnd: boolean;
}

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

    // TODO: wrong reach start and reach end logic
    async getPrizeList(
        drawId: string,
        pageSize: number,
        filter: PrizeSearchFilter,
        pageOption?: PrizePaginatorOption
    ): Promise<PrizeList> {
        console.log('get prize list');

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
                where(PrizeKey.name, '<=', searchValue + '\uf8ff')
            );
            queryConstraints.push(where(PrizeKey.name, '>=', searchValue));
        }
        queryConstraints.push(orderBy(PrizeKey.sequence, 'desc'));

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
        sequence: number
    ): Promise<boolean> {
        const sequenceQuery = query(
            collection(this.db, USERS_KEY, uid, DRAWS_KEY, drawId, PRIZES_KEY),
            where(PrizeKey.sequence, '==', sequence),
            limit(1)
        );
        const docs = await getDocs(sequenceQuery);
        return !docs.empty;
    }

    // TODO: better change to cloud function
    async createPrizes(
        drawId: string,
        prizes: Pick<Prize, 'name' | 'sequence' | 'sponsor'>[]
    ): Promise<void> {
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

    async editPrize(
        drawId: string,
        prize: Pick<
            Prize,
            | 'id'
            | PrizeKey.name
            | PrizeKey.sequence
            | PrizeKey.sponsor
            | PrizeKey.winnerId
        >
    ): Promise<void> {
        return runTransaction(this.db, async (transaction) => {
            const prizeRef = this.getPrizeRef(drawId, prize.id);
            const prizeDoc = await transaction.get(prizeRef);
            if (!prizeDoc.exists()) throw new Error('Prize does not exist');

            // TODO: Add logic to validate if the participant has been assigned to any prize
            transaction.update(prizeRef, omit(prize, 'id'));
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
                    const updatedProps: Pick<
                        Participant,
                        | ParticipantKey.prize
                        | ParticipantKey.prizeId
                        | ParticipantKey.prizeWinner
                    > = {
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
