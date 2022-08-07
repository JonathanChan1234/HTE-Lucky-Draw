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

export const ToJSONObject = (
    doc: QueryDocumentSnapshot<DocumentData>
): Participant => ({
    name: doc.data()['name'],
    id: doc.id,
    signedIn: doc.data()['signedIn'],
    signedInAt: doc.data()['signedInAt'],
    random: doc.data()['random'],
    prizeWinner: doc.data()['prizeWinner'],
    prize: doc.data()['prize'],
    prizeId: doc.data()['prizeId'],
    message: doc.data()['message'],
});
