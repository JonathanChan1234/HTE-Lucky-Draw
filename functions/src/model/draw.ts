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
): Draw | undefined =>
    doc.data()
        ? {
              id: doc.id,
              name: doc.data()?.['name'],
              prizeCount: doc.data()?.['prizeCount'],
              participantCount: doc.data()?.['participantCount'],
              signInCount: doc.data()?.['signInCount'],
              signInRequired: doc.data()?.['signInRequired'],
              lock: doc.data()?.['lock'],
              createdAt: doc.data()?.['createdAt'],
          }
        : undefined;
