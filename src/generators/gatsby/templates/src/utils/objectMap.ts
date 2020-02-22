/* eslint-disable @typescript-eslint/no-explicit-any */
export const objectMap = (object: any, mapFn: (p: any) => any) => {
    return Object.keys(object).reduce((result: any, key: any) => {
        result[key] = mapFn(object[key]);
        return result;
    }, {});
};
