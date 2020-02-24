import yeoman from 'yeoman-environment';
import BaseGenerator, { CommonAnswers } from '../app/base';
import { EmptyAdapter } from '../app/emptyAdapter';

const env = yeoman.createEnv([], {}, process.env.NODE_ENV === 'test' ? new EmptyAdapter() : undefined);
env.register(require.resolve('../node'));

export interface Answers extends CommonAnswers {
    useRedux: boolean; // TODO
    dockerTag: string; // TODO
}

export default class extends BaseGenerator<Answers> {
    constructor(args: string | string[], opts: {}) {
        super(args, opts);
        this.answers.useRedux = true;
        this.answers.dockerTag = this.answers.moduleName;
    }

    initializing() {
        const done = this.async();
        env.run(
            'mht:node',
            { ...this.options, local: true, 'skip-git': true, 'skip-installation': true },
            (err: null | Error) => {
                if (err) this.log(`${err.stack}\n${err.name}: ${err.message}`);
                else done();
            },
        );
        this.log('test3');
    }

    end() {
        this.log('test4');
        this.cp('__mocks__');
        this.cp('src');
        this.cp('_.stylelintrc.json', '.stylelintrc.json');
        this.cp('.dockerignore');
        this.cp('Dockerfile');
        this.cp('gatsby-browser.js');
        this.cp('gatsby-config.js');
        this.cp('gatsby-node.js');
        this.cp('gatsby-ssr.js');
        this.cpr('jest.config.js');
        this.cp('jest.loadershim.js');
        this.cp('jest.preprocess.js');
        this.cp('jest.setup.js');
        this.cp('jest.setup.ts');
        this.cp('nginx.conf');

        this.ex('_.eslintrc.json', '.eslintrc.json');
        this.ex('_package.json', 'package.json');
        this.ex('tsconfig.json');
    }
}
