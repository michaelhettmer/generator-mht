import Generator from 'yeoman-generator';
import kebabCase from 'lodash.kebabcase';

export default class extends Generator {
    constructor(args: string | string[], options: {}) {
        super(args, options);
    }

    init() {
        return this.prompt([
            {
                name: 'moduleName',
                message: 'What do you want to name your module?',
                default: this.appname.replace(/\s/g, '-'),
                filter: x => kebabCase(x).toLowerCase(),
            },
        ]);
    }
}
