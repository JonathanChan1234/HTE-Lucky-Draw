import { Injectable } from '@angular/core';
import {
    Firestore,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    startAfter,
} from '@angular/fire/firestore';
import { collection, endBefore, limitToLast, where } from '@firebase/firestore';
import { AuthService } from '../service/auth.service';
import { Prize, prizeDocToJsonObject, PrizeKey } from './prize';
import { PrizePaginatorOption, PrizeSearchFilter } from './prize.reducer';

const USERS_KEY = 'users';
const DRAWS_KEY = 'draws';
const PRIZE_KEY = 'prizes';

export interface PrizeList {
    prizes: Prize[];
    reachStart: boolean;
    reacheEnd: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class PrizeService {
    constructor(private db: Firestore, private authService: AuthService) {}

    async getPrizeList(
        drawId: string,
        pageSize: number,
        filter: PrizeSearchFilter,
        pageOption: PrizePaginatorOption
    ): Promise<PrizeList> {
        const prizes = await this.getPrizes(
            drawId,
            pageSize,
            filter,
            pageOption
        );
        if (prizes.length === 0)
            return { prizes, reachStart: true, reacheEnd: true };

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
                reachStart: pageOption !== undefined ? false : true,
                reacheEnd: nextPrize.length === 0,
            };
        }
        const nextPrize = await this.getPrizes(drawId, 1, filter, {
            type: 'endBefore',
            id: prizes[0].id,
        });
        return { prizes, reachStart: nextPrize.length === 0, reacheEnd: false };
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
            queryConstraints.push(where(PrizeKey.name, '<=', searchValue));
            queryConstraints.push(
                where(PrizeKey.name, '>=', searchValue + '\uf8ff')
            );
            queryConstraints.push(orderBy(PrizeKey.name));
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
            collection(this.db, USERS_KEY, uid, DRAWS_KEY, drawId, PRIZE_KEY),
            ...[...queryConstraints]
        );
        const documentSnapshots = await getDocs(getPrizeQuery);
        return documentSnapshots.docs.map((doc) => prizeDocToJsonObject(doc));
    }
}
