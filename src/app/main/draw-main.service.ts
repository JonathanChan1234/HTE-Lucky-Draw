import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Participant } from '../participant/participant';
import { ParticipantDbService } from '../participant/participant-db.service';
import { PrizeService } from '../prize/prize.service';
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
export class DrawMainService {
    constructor(
        private participantSerivce: ParticipantDbService,
        private prizeService: PrizeService
    ) {}

    // TODO: Add the firestore logic later
    async selectRandomParticipants(
        drawId: string,
        numberOfPrizes: number
    ): Promise<DrawGroup[]> {
        return Array<DrawGroup>(numberOfPrizes).fill({
            winner: candidates[0],
            candidates,
        });
    }
}
