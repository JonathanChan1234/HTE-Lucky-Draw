export const getRandomKey = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
};

export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};
