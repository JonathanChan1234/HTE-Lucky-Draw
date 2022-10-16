import { DocumentData, Query } from 'firebase-admin/firestore';
import { firestore } from '../firebase';
import { drawDocToJsonData, DRAWS_KEY, USERS_KEY } from '../model/draw';
import {
    Participant,
    participantDocToJsonObject,
    ParticipantKey,
    PARTICIPANTS_KEY,
} from '../model/participant';
import {
    Prize,
    prizeDocToJsonObject,
    PrizeKey,
    PRIZES_KEY,
} from '../model/prize';
import { getRandomWithMax } from '../utils/random';

export interface PrizeWinnerGroup {
    prize: Prize;
    winner: Participant;
    candidates: Participant[];
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
        const drawDoc = await transaction.get(
            firestore
                .collection(USERS_KEY)
                .doc(userId)
                .collection(DRAWS_KEY)
                .doc(drawId)
        );
        if (!drawDoc.exists) throw new Error('Draw Id does not exist');
        const draw = drawDocToJsonData(drawDoc);
        const excludedIds: string[] = [];
        for (const prizeId of prizeIds) {
            const prizeDoc = await transaction.get(
                prizeRefBuilder(userId, drawId, prizeId)
            );
            const prize = prizeDocToJsonObject(prizeDoc);
            if (!prizeDoc.exists || prize === undefined)
                throw new Error('Prize does not exists');
            if (prize.assigned)
                throw new Error(
                    `Prize ${prize.name} (ID: ${prize.id}) has already been assigned`
                );
            const random = getRandomWithMax(Number.MAX_SAFE_INTEGER);
            const operator = getRandomWithMax(2);
            let participantRef = randomParticipantQueryBuilder(
                userId,
                drawId,
                random,
                operator ? '>=' : '<=',
                draw.signInRequired
            );
            let group: Participant[] = (
                await transaction.get(participantRef)
            ).docs
                .map((doc) => participantDocToJsonObject(doc))
                .filter((participant) => !excludedIds.includes(participant.id));

            if (group.length === 0) {
                participantRef = randomParticipantQueryBuilder(
                    userId,
                    drawId,
                    random,
                    operator ? '<=' : '>=',
                    draw.signInRequired
                );
                group = (await transaction.get(participantRef)).docs
                    .map((doc) => participantDocToJsonObject(doc))
                    .filter(
                        (participant) => !excludedIds.includes(participant.id)
                    );
            }
            if (group.length === 0)
                throw new Error('No available participants');
            const winner = group[getRandomWithMax(group.length)];
            excludedIds.push(winner.id);
            groups.push({ prize, winner, candidates: group });
        }

        for (const group of groups) {
            // Update participant's status
            transaction.update(
                participantRefBuilder(userId, drawId, group.winner.id),
                {
                    [ParticipantKey.prize]: group.prize.name,
                    [ParticipantKey.prizeId]: group.prize.id,
                    [ParticipantKey.prizeWinner]: true,
                }
            );
            // Update prize's status
            transaction.update(
                prizeRefBuilder(userId, drawId, group.prize.id),
                {
                    [PrizeKey.assigned]: true,
                    [PrizeKey.winner]: group.winner.name,
                    [PrizeKey.winnerId]: group.winner.id,
                }
            );
        }
    });
    groups.forEach((group) => console.log(group.winner));
    return groups;
};

export const resetDraw = async (uid: string, drawId: string) => {
    const participantDocs = await firestore
        .collection(USERS_KEY)
        .doc(uid)
        .collection(DRAWS_KEY)
        .doc(drawId)
        .collection(PARTICIPANTS_KEY)
        .where(ParticipantKey.prizeWinner, '==', true)
        .get();
    const prizeDocs = await firestore
        .collection(USERS_KEY)
        .doc(uid)
        .collection(DRAWS_KEY)
        .doc(drawId)
        .collection(PRIZES_KEY)
        .where(PrizeKey.assigned, '==', true)
        .get();

    for (let i = 0; i < Math.ceil(participantDocs.size / 500); ++i) {
        await firestore.runTransaction(async (transaction) => {
            participantDocs.docs
                .slice(i * 500, (i + 1) * 500)
                .forEach((doc) => {
                    transaction.update(doc.ref, {
                        [ParticipantKey.prize]: '',
                        [ParticipantKey.prizeId]: '',
                        [ParticipantKey.prizeWinner]: false,
                    });
                });
        });
    }
    for (let i = 0; i < Math.ceil(prizeDocs.size / 500); ++i) {
        await firestore.runTransaction(async (transaction) => {
            prizeDocs.docs.slice(i * 500, (i + 1) * 500).forEach((doc) => {
                transaction.update(doc.ref, {
                    [PrizeKey.assigned]: false,
                    [PrizeKey.winner]: '',
                    [PrizeKey.winnerId]: '',
                });
            });
        });
    }
};

const prizeRefBuilder = (userId: string, drawId: string, prizeId: string) => {
    return firestore
        .collection(USERS_KEY)
        .doc(userId)
        .collection(DRAWS_KEY)
        .doc(drawId)
        .collection(PRIZES_KEY)
        .doc(prizeId);
};

const participantRefBuilder = (
    userId: string,
    drawId: string,
    participantId: string
) => {
    return firestore
        .collection(USERS_KEY)
        .doc(userId)
        .collection(DRAWS_KEY)
        .doc(drawId)
        .collection(PARTICIPANTS_KEY)
        .doc(participantId);
};

const randomParticipantQueryBuilder = (
    userId: string,
    drawId: string,
    random: number,
    operator: '>=' | '<=',
    signInRequired: boolean
): Query<DocumentData> => {
    return firestore
        .collection(USERS_KEY)
        .doc(userId)
        .collection(DRAWS_KEY)
        .doc(drawId)
        .collection(PARTICIPANTS_KEY)
        .where(ParticipantKey.signedIn, '==', signInRequired)
        .where(ParticipantKey.prizeWinner, '==', false)
        .where(ParticipantKey.random, operator, random)
        .limit(10);
};
