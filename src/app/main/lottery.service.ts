import { Injectable } from '@angular/core';
import {
    collection,
    Firestore,
    getDocs,
    limit,
    query,
    Timestamp,
    where,
} from '@angular/fire/firestore';
import { doc, runTransaction } from '@firebase/firestore';
import {
    Participant,
    participantDocToJsonObject,
    ParticipantKey,
    PARTICIPANTS_KEY,
} from '../participant/participant';
import { DRAWS_KEY } from '../participant/participant-db.service';
import { Prize, PrizeKey, PRIZES_KEY } from '../prize/prize';
import { AuthService, USERS_KEY } from '../service/auth.service';
import { getRandomInt, getRandomKey } from '../utility/random';
import { DrawGroup } from './draw-main.reducer';

// TODO: Remove test data later
const candidates: Participant[] = [
    {
        id: '1',
        name: 'test 1',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
    {
        id: '2',
        name: 'test 2',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
    {
        id: '3',
        name: 'test 3',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
    {
        id: '4',
        name: 'test 4',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
    {
        id: '5',
        name: 'test 5',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
    {
        id: '6',
        name: 'test 6',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
    {
        id: '7',
        name: 'test 7',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
    {
        id: '8',
        name: 'test 8',
        message: 'test message',
        prize: '',
        prizeId: '',
        prizeWinner: false,
        random: 100,
        signedIn: true,
        signedInAt: Timestamp.now(),
    },
];

@Injectable({
    providedIn: 'root',
})
export class LotteryService {
    constructor(private db: Firestore, private authService: AuthService) {}

    async selectRandomParticipants(
        drawId: string,
        prizes: Prize[]
    ): Promise<DrawGroup[]> {
        const uid = this.authService.getUserId();
        if (!uid) throw new Error('Not signed in');
        const drawGroups: DrawGroup[] = [];
        const winners: string[] = [];

        for (const prize of prizes) {
            const candidates = await this.fetchRandomParticipant(
                uid,
                drawId,
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
        await this.assignPrizes(uid, drawId, drawGroups);
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
        drawId: string,
        idsNotIncluded: string[]
    ): Promise<Participant[]> {
        const randomComparator = getRandomInt(2);
        const random = getRandomKey();
        let participants = await this.fetchRandomParticipantHelper(
            uid,
            drawId,
            random,
            randomComparator ? '>' : '<',
            idsNotIncluded
        );

        if (participants.length === 0) {
            participants = await this.fetchRandomParticipantHelper(
                uid,
                drawId,
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
        drawId: string,
        random: number,
        comparator: '<' | '>',
        idsNotIncluded: string[]
    ): Promise<Participant[]> {
        const getParticipantQuery = query(
            collection(
                this.db,
                USERS_KEY,
                uid,
                DRAWS_KEY,
                drawId,
                PARTICIPANTS_KEY
            ),
            where(ParticipantKey.prizeWinner, '==', false),
            where(ParticipantKey.random, comparator, random),
            limit(10)
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
