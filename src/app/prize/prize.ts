import {
    DocumentData,
    QueryDocumentSnapshot,
    Timestamp,
} from '@angular/fire/firestore';

export type Prize = {
    id: string;
    name: string;
    assigned: boolean;
    winnerId?: string;
    winner?: string;
    sequence: number;
    sponsor?: string;
    addedAt: Timestamp;
};

export enum PrizeKey {
    name = 'name',
    assigned = 'assigned',
    winner = 'winner',
    winnerId = 'winnerId',
    sequence = 'sequence',
    sponsor = 'sponsor',
    addedAt = 'addedAt',
}

export const prizeDocToJsonObject = (
    doc: QueryDocumentSnapshot<DocumentData>
): Prize => ({
    id: doc.id,
    name: doc.data()[PrizeKey.name],
    assigned: doc.data()[PrizeKey.assigned],
    winner: doc.data()[PrizeKey.winner],
    winnerId: doc.data()[PrizeKey.winnerId],
    sequence: doc.data()[PrizeKey.sequence],
    sponsor: doc.data()[PrizeKey.sponsor],
    addedAt: doc.data()[PrizeKey.addedAt],
});
