import { csvParser } from '../utility/csv';

type ParticipantRaw = {
    id: string;
    name: string;
    isSignedIn: string;
    message: string;
};

interface Participant {
    id: string;
    name: string;
    isSignedIn: boolean;
    message: string;
}

export const participantListCsvParser = (data: string): Participant[] => {
    const participantRawList = csvParser<ParticipantRaw>(data);
    const participants: Participant[] = [];
    for (const { id, name, isSignedIn, message } of participantRawList) {
        if (name === undefined || name === '')
            throw new Error(`name column does not exist or the name is empty`);
        if (id === undefined || id === '')
            throw new Error(`id column does not exist or the id is empty`);
        if (message === undefined)
            throw new Error(`message column does not exist`);

        if (
            isSignedIn === undefined ||
            (isSignedIn !== 'true' && isSignedIn !== 'false')
        )
            throw new Error(`Invalid isSignedIn value ${isSignedIn}`);
        participants.push({
            id,
            name,
            isSignedIn: isSignedIn === 'true' ? true : false,
            message,
        });
    }
    return participants;
};
