import crypto from 'node:crypto';

export const getRandomInt = (): number => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
};

export const getRandomWithMax = (max: number): number =>
    Math.floor(Math.random() * max);
