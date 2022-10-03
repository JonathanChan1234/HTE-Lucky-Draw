type CsvObject = {
    [key: string]: string;
};

export function csvParser<T extends CsvObject>(csv: string): T[] {
    const arr: T[] = [];
    const objArr = csv.split('\r\n');

    if (objArr.length === 0) return arr;
    const headers = getCsvRowObj(objArr[0]);
    for (let i = 1; i < objArr.length; ++i) {
        const rowObjArr = getCsvRowObj(objArr[i]);
        const rowObj: CsvObject = {};
        if (rowObjArr.length !== headers.length) continue;
        for (let j = 0; j < headers.length; ++j) {
            rowObj[headers[j]] = rowObjArr[j];
        }
        arr.push(rowObj as T);
    }
    return arr;
}

function getCsvRowObj(headerRow: string): string[] {
    let flag = 0;
    let str = '';
    for (let char of headerRow) {
        if (flag === 0 && char === '"') flag = 1;
        if (flag === 1 && char === '"') flag = 0;
        if (flag === 0 && char === ',') char = '|';
        if (char !== '"') str += char;
    }
    return str.split('|');
}
