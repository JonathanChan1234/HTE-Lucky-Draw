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
    ParticipantPaginatorOption,
    ParticipantSearchFilter,
} from './participant.service';

export interface ParticipantData {
    participants: Participant[];
    reachStart: boolean;
    reachEnd: boolean;
}

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

        if (pageOption) {
            if (pageOption.type === 'startAfter') {
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
                    reachStart: false,
                    reachEnd: nextParticipant.length === 0,
                };
            }
            const nextParticipant = await this.getParticipants(
                drawId,
                1,
                filter,
                {
                    type: 'endBefore',
                    id: participants[0].id,
                }
            );
            return {
                participants,
                reachEnd: false,
                reachStart: nextParticipant.length === 0,
            };
        }
        const nextParticipant = await this.getParticipants(drawId, 1, filter, {
            type: 'startAfter',
            id: participants[participants.length - 1].id,
        });
        return {
            participants,
            reachStart: true,
            reachEnd: nextParticipant.length < 0,
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
            collection(this.db, 'users', uid, 'draws', drawId, 'participants'),
            ...[...queryConstraints, limit(pageSize)]
        );
        const documentSnapshots = await getDocs(getParticipantQuery);

        return documentSnapshots.docs.map((doc) => ToJSONObject(doc));
    }
}
