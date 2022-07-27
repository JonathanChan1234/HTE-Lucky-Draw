import {
    DocumentData,
    QueryDocumentSnapshot,
    Timestamp,
    WithFieldValue,
} from '@angular/fire/firestore';

export class Draw {
    id: string;
    name: string;
    prizeCount: number;
    participantCount: number;
    signInCount: number;
    signInRequired: boolean;
    lock: boolean;
    createdAt: Timestamp;

    constructor(
        name: string,
        id: string = '',
        prizeCount = 0,
        participantCount = 0,
        signInCount = 0,
        signInRequired = false,
        lock = false,
        createdAt = Timestamp.fromDate(new Date())
    ) {
        this.name = name;
        this.id = id;
        this.prizeCount = prizeCount;
        this.participantCount = participantCount;
        this.signInCount = signInCount;
        this.signInRequired = signInRequired;
        this.lock = lock;
        this.createdAt = createdAt;
    }

    static ToJSONObject(doc: QueryDocumentSnapshot<DocumentData>) {
        return new Draw(
            doc.data()['name'],
            doc.id,
            doc.data()['prizeCount'],
            doc.data()['participantCount'],
            doc.data()['signInCount'],
            doc.data()['signInRequired'],
            doc.data()['lock'],
            doc.data()['createdAt']
        );
    }

    toFirebaseData(): WithFieldValue<DocumentData> {
        return {
            name: this.name,
            prizeCount: this.prizeCount,
            participantCount: this.participantCount,
            signInCount: this.signInCount,
            signInRequired: this.signInRequired,
            lock: this.lock,
            createdAt: this.createdAt,
        };
    }
}
