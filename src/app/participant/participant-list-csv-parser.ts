import { csvParser } from '../utility/csv';

type ParticipantRaw = {
    id: string;
    name: string;
    signedIn: string;
    message: string;
};

export interface ImportedParticipant {
    id: string;
    name: string;
    signedIn: boolean;
    message: string;
}

export const participantListCsvParser = (
    data: string
): ImportedParticipant[] => {
    const participantRawList = csvParser<ParticipantRaw>(data);
    const participants: ImportedParticipant[] = [];

    for (const { id, name, signedIn, message } of participantRawList) {
        if (name === undefined || name === '')
            throw new Error(`name column does not exist or the name is empty`);
        if (id === undefined || id === '')
            throw new Error(`id column does not exist or the id is empty`);
        if (message === undefined)
            throw new Error(`message column does not exist`);

        if (
            signedIn === undefined ||
            (signedIn !== 'true' && signedIn !== 'false')
        )
            throw new Error(`Invalid isSignedIn value ${signedIn}`);
        participants.push({
            id,
            name,
            signedIn: signedIn === 'true' ? true : false,
            message,
        });
    }
    return participants;
};
