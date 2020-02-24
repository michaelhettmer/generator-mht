import emptyLogger from './emptyLogger';

export class EmptyAdapter {
    diff = () => '';
    prompt = async () => '';
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
