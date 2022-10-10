import {
    DocumentData,
    DocumentSnapshot,
    Timestamp,
} from 'firebase-admin/firestore';

export type Draw = {
    id: string;
    name: string;
    prizeCount: number;
    participantCount: number;
    signInCount: number;
    signInRequired: boolean;
    lock: boolean;
    createdAt: Timestamp;
};

export const USERS_KEY = 'users';
export const DRAWS_KEY = 'draws';

export enum DrawKey {
    id = 'id',
    name = 'name',
    prizeCount = 'prizeCount',
    participantCount = 'participantCount',
    signInCount = 'signInCount',
    signInRequired = 'signInRequired',
    lock = 'lock',
    createdAt = 'createdAt',
}

export const drawDocToJsonData = (
    doc: DocumentSnapshot<DocumentData>
): Draw => {
    const data = doc.data();
    if (data === undefined) throw new Error('Draw cannot be decoded');
    return {
        id: doc.id,
        name: data[DrawKey.name],
        prizeCount: data[DrawKey.prizeCount],
        participantCount: data[DrawKey.participantCount],
        signInCount: data[DrawKey.signInCount],
        signInRequired: data[DrawKey.signInRequired],
        lock: data[DrawKey.lock],
        createdAt: data[DrawKey.createdAt],
    };
};
