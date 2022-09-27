import { Timestamp } from 'firebase-admin/firestore';
import firestore from '../firestore';
import {
    drawDocToJsonData,
    DrawKey,
    DRAWS_KEY,
    USERS_KEY,
} from '../model/draw';
import {
    Participant,
    participantDocToJsonObject,
    ParticipantKey,
    PARTICIPANTS_KEY,
} from '../model/participant';

export const participantSignIn = async (
    userId: string,
    drawId: string,
    participantId: string
): Promise<Participant> => {
    const drawRef = firestore
        .collection(USERS_KEY)
        .doc(userId)
        .collection(DRAWS_KEY)
        .doc(drawId);
    const participantRef = firestore
        .collection(USERS_KEY)
        .doc(userId)
        .collection(DRAWS_KEY)
        .doc(drawId)
        .collection(PARTICIPANTS_KEY)
        .doc(participantId);

    await firestore.runTransaction(async (transaction) => {
        const drawDoc = await transaction.get(drawRef);
        if (!drawDoc.exists) throw new Error('Draw Id does not exists');
        const draw = drawDocToJsonData(drawDoc);

        const participantDoc = await transaction.get(participantRef);
        if (!participantDoc.exists)
            throw new Error('Participant Id does not exist');
        const participant = participantDocToJsonObject(participantDoc);

        if (participant === undefined || draw === undefined)
            throw new Error('Empty Data in Participant/Draw');

        if (participant.signedIn)
            transaction.update(drawRef, {
                [DrawKey.signInCount]: draw.signInCount + 1,
            });
        transaction.update(participantRef, {
            [ParticipantKey.signedIn]: true,
            [ParticipantKey.signedInAt]: Timestamp.now(),
        });
    });
    const participantDoc = await participantRef.get();
    const participant = participantDocToJsonObject(participantDoc);
    if (!participant) throw new Error('Participant does not exist');
    return participant;
};
