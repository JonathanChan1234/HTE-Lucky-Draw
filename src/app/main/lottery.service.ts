import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    collection,
    Firestore,
    getDocs,
    limit,
    query,
    QueryConstraint,
    where,
} from '@angular/fire/firestore';
import { doc, runTransaction } from '@firebase/firestore';
import { catchError, Observable } from 'rxjs';
import { Draw, DRAWS_KEY, USERS_KEY } from '../draw/draw';
import {
    Participant,
    participantDocToJsonObject,
    ParticipantKey,
    PARTICIPANTS_KEY,
} from '../participant/participant';
import { Prize, PrizeKey, PRIZES_KEY } from '../prize/prize';
import { AuthService } from '../service/auth.service';
import { httpHandleErrorFactory } from '../utility/http';
import { getRandomInt, getRandomKey } from '../utility/random';
import { DrawGroup } from './draw-main.reducer';

@Injectable({
    providedIn: 'root',
})
export class LotteryService {
    constructor(
        private db: Firestore,
        private authService: AuthService,
        private httpClient: HttpClient
    ) {}

    luckyDrawHelper(draw: Draw, prizes: Prize[]): Observable<DrawGroup[]> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        return this.httpClient
            .post<DrawGroup[]>(`${uid}/draw/${draw.id}/luckyDraw`, {
                prizeIds: prizes.map((prize) => prize.id),
            })
            .pipe(catchError(httpHandleErrorFactory));
    }

    async selectRandomParticipants(
        draw: Draw,
        prizes: Prize[]
    ): Promise<DrawGroup[]> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        const drawGroups: DrawGroup[] = [];
        const winners: string[] = [];

        for (const prize of prizes) {
            const candidates = await this.fetchRandomParticipant(
                uid,
                draw,
                winners
            );
            const randomWinnerIndex = getRandomInt(candidates.length);
            const winner = candidates[randomWinnerIndex];
            winners.push(winner.id);
            drawGroups.push({
                winner,
                candidates,
                prize,
            });
        }
        await this.assignPrizes(uid, draw.id, drawGroups);
        return drawGroups;
    }

    async assignPrizes(
        uid: string,
        drawId: string,
        groups: DrawGroup[]
    ): Promise<void> {
        return runTransaction(this.db, async (transaction) => {
            for (const { winner, prize } of groups) {
                const participantRef = doc(
                    this.db,
                    USERS_KEY,
                    uid,
                    DRAWS_KEY,
                    drawId,
                    PARTICIPANTS_KEY,
                    winner.id
                );
                const prizeRef = doc(
                    this.db,
                    USERS_KEY,
                    uid,
                    DRAWS_KEY,
                    drawId,
                    PRIZES_KEY,
                    prize.id
                );
                transaction.update(participantRef, {
                    [ParticipantKey.prize]: prize.name,
                    [ParticipantKey.prizeWinner]: true,
                    [ParticipantKey.prizeId]: prize.id,
                });
                transaction.update(prizeRef, {
                    [PrizeKey.assigned]: true,
                    [PrizeKey.winner]: winner.name,
                    [PrizeKey.winnerId]: winner.id,
                });
            }
        });
    }

    async fetchRandomParticipant(
        uid: string,
        draw: Draw,
        idsNotIncluded: string[]
    ): Promise<Participant[]> {
        const randomComparator = getRandomInt(2);
        const random = getRandomKey();
        let participants = await this.fetchRandomParticipantHelper(
            uid,
            draw,
            random,
            randomComparator ? '>' : '<',
            idsNotIncluded
        );

        if (participants.length === 0) {
            participants = await this.fetchRandomParticipantHelper(
                uid,
                draw,
                random,
                randomComparator ? '<' : '>',
                idsNotIncluded
            );
        }
        if (participants.length === 0)
            throw new Error('No eligible participant');
        return participants;
    }

    async fetchRandomParticipantHelper(
        uid: string,
        draw: Draw,
        random: number,
        comparator: '<' | '>',
        idsNotIncluded: string[]
    ): Promise<Participant[]> {
        const queryConstraint: QueryConstraint[] = [
            where(ParticipantKey.prizeWinner, '==', false),
            where(ParticipantKey.random, comparator, random),
        ];
        if (draw.signInRequired)
            queryConstraint.push(where(ParticipantKey.signedIn, '==', true));
        const getParticipantQuery = query(
            collection(
                this.db,
                USERS_KEY,
                uid,
                DRAWS_KEY,
                draw.id,
                PARTICIPANTS_KEY
            ),
            ...[...queryConstraint, limit(10)]
        );
        const snapshot = await getDocs(getParticipantQuery);
        return snapshot.docs
            .map((doc) => participantDocToJsonObject(doc))
            .filter(
                (participant) =>
                    idsNotIncluded.findIndex((id) => id === participant.id) ===
                    -1
            );
    }
}
