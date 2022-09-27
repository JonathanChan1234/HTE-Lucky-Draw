import { DocumentData, Query } from 'firebase-admin/firestore';
import { DRAWS_KEY, USERS_KEY } from 'model/draw';
import {
    Participant,
    participantDocToJsonObject,
    ParticipantKey,
    PARTICIPANTS_KEY,
} from 'model/participant';
import { Prize, prizeDocToJsonObject, PRIZES_KEY } from 'model/prize';
import { getRandomInt, getRandomWithMax } from 'utils/random';
import firestore from '../firestore';

export interface PrizeWinnerGroup {
    prize: Prize;
    winner: Participant;
    group: Participant[];
}

/**
 *
 * @param userId uid
 * @param drawId draw id
 * @param prizeIds the array of prize id that would be assigned
 */
export const selectRandomParticipants = async (
    userId: string,
    drawId: string,
    prizeIds: string[]
) => {
    const groups: PrizeWinnerGroup[] = [];
    await firestore.runTransaction(async (transaction) => {
        const excludedIds: string[] = [];
        for (const prizeId of prizeIds) {
            const prizeRef = firestore
                .collection(USERS_KEY)
                .doc(userId)
                .collection(DRAWS_KEY)
                .doc(drawId)
                .collection(PRIZES_KEY)
                .doc(prizeId);
            const prizeDoc = await transaction.get(prizeRef);
            const prize = prizeDocToJsonObject(prizeDoc);
            if (!prizeDoc.exists || prize === undefined)
                throw new Error('Prize does not exists');
            if (prize.assigned)
                throw new Error(
                    `Prize ${prize.name} (ID: ${prize.id}) has already been assigned`
                );
            const random = getRandomInt();
            const operator = getRandomWithMax(2) ? '>=' : '<=';
            let participantRef = randomParticipantQueryHelper(
                userId,
                drawId,
                random,
                operator
            );
            let group = (await transaction.get(participantRef)).docs
                .map((doc) => participantDocToJsonObject(doc))
                .filter(
                    (participant) =>
                        participant && !excludedIds.includes(participant.id)
                );

            if (group.length === 0) {
                participantRef = randomParticipantQueryHelper(
                    userId,
                    drawId,
                    random,
                    operator
                );
                group = (await transaction.get(participantRef)).docs
                    .map((doc) => participantDocToJsonObject(doc))
                    .filter(
                        (participant) =>
                            participant && !excludedIds.includes(participant.id)
                    );
            }
            if (group.length === 0)
                throw new Error('No available participants');
            const winner = group[getRandomWithMax(group.length)];
            groups.push({
                prize,
                winner: winner as Participant,
                group: group as Participant[],
            });
        }
        // TODO: Assign prize to winner
    });
    return groups;
};

const randomParticipantQueryHelper = (
    userId: string,
    drawId: string,
    random: number,
    operator: '>=' | '<='
): Query<DocumentData> => {
    return firestore
        .collection(USERS_KEY)
        .doc(userId)
        .collection(DRAWS_KEY)
        .doc(drawId)
        .collection(PARTICIPANTS_KEY)
        .where(ParticipantKey.signedIn, '==', true)
        .where(ParticipantKey.prizeWinner, '==', false)
        .where(ParticipantKey.random, operator, random)
        .limit(10);
};
