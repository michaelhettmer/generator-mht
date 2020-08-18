import emptyLogger from './emptyLogger';

export class EmptyAdapter {
    diff = (): string => '';
    prompt = async (): Promise<string> => '';
    // eslint-disable-next-line @typescript-eslint/ban-types
    log: {} | undefined;
}

EmptyAdapter.prototype.log = emptyLogger({
    colors: {
        skip: 'yellow',
        force: 'yellow',
        create: 'green',
        merge: 'green',
        invoke: 'bold',
        conflict: 'red',
        identical: 'cyan',
        info: 'gray',
    },
});
