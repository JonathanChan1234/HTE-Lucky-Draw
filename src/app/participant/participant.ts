import {
    DocumentData,
    QueryDocumentSnapshot,
    Timestamp,
} from '@angular/fire/firestore';

export type Participant = {
    name: string;
    id: string;
    signedIn: boolean;
    signedInAt: Timestamp;
    random: number;
    prize: string;
    prizeId: string;
    message: string;
    prizeWinner: boolean;
};

export const PARTICIPANTS_KEY = 'participants';

export enum ParticipantKey {
    id = 'id',
    name = 'name',
    signedIn = 'signedIn',
    signedInAt = 'signedInAt',
    random = 'random',
    prizeWinner = 'prizeWinner',
    prize = 'prize',
    prizeId = 'prizeId',
    message = 'message',
}

export const participantDocToJsonObject = (
    doc: QueryDocumentSnapshot<DocumentData>
): Participant => ({
    id: doc.id,
    name: doc.data()[ParticipantKey.name],
    signedIn: doc.data()[ParticipantKey.signedIn],
    signedInAt: doc.data()[ParticipantKey.signedInAt],
    random: doc.data()[ParticipantKey.random],
    prizeWinner: doc.data()[ParticipantKey.prizeWinner],
    prize: doc.data()[ParticipantKey.prize],
    prizeId: doc.data()[ParticipantKey.prizeId],
    message: doc.data()[ParticipantKey.message],
});
