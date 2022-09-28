import {
    DocumentData,
    DocumentSnapshot,
    Timestamp,
} from 'firebase-admin/firestore';

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
    doc: DocumentSnapshot<DocumentData>
): Participant => {
    const data = doc.data();
    if (data === undefined) throw new Error('Empty Doc Data');
    return {
        id: doc.id,
        name: data[ParticipantKey.name],
        signedIn: data[ParticipantKey.signedIn],
        signedInAt: data[ParticipantKey.signedInAt],
        random: data[ParticipantKey.random],
        prizeWinner: data[ParticipantKey.prizeWinner],
        prize: data[ParticipantKey.prize],
        prizeId: data[ParticipantKey.prizeId],
        message: data[ParticipantKey.message],
    };
};
