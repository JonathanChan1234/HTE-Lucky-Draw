import { csvParser } from '../utility/csv';
import { CreatePrizeDao } from './prize.action';

type PrizeRaw = {
    name: string;
    sequence: string;
    sponsor: string;
};

export const prizeListCsvParser = (data: string): CreatePrizeDao[] => {
    const prizeRawList = csvParser<PrizeRaw>(data);
    const prizes: CreatePrizeDao[] = [];

    for (const { name, sponsor, sequence } of prizeRawList) {
        if (name === undefined || name === '')
            throw new Error(`name column does not exist or the name is empty`);
        if (sponsor === undefined)
            throw new Error(`sponsor column does not exist`);
        if (sequence === undefined || Number.isNaN(Number.parseInt(sequence)))
            throw new Error('Invalid sequence');

        prizes.push({
            name,
            sponsor,
            sequence: Number.parseInt(sequence),
        });
    }
    return prizes;
};
