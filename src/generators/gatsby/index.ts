import yeoman from 'yeoman-environment';
import kebabCase from 'lodash.kebabcase';
import BaseGenerator, { CommonAnswers } from '../app/base';
import { EmptyAdapter } from '../app/emptyAdapter';

const env = yeoman.createEnv([], {}, process.env.NODE_ENV === 'test' ? new EmptyAdapter() : undefined);
env.register(require.resolve('../node'));

export interface Answers extends CommonAnswers {
    redux: boolean;
    dockerTag: string;
}

export default class extends BaseGenerator<Answers> {
    initializing() {
        const done = this.async();
        env.run(
            require.resolve('../node'),
            { ...this.options, local: true, 'skip-git': true, 'skip-installation': true },
            (err: null | Error) => {
                if (err) this.log(`${err.stack}\n${err.name}: ${err.message}`);
                else done();
            },
        );
    }

    async prompting() {
        this.answers.dockerUserName = this.answers.repoUserName.toLowerCase().replace(/\s/g, '');
        await this.prompts(['dockerUserName']);
        this.answers.redux = true;
        const repoName = kebabCase(this.answers.repoName.replace(/\s/g, '-')).toLowerCase();
        if (this.answers.repo === 'GitLab')
            this.answers.dockerTag = `registry.gitlab.com/${this.answers.repoUserName}/${this.answers.repoName}/${repoName}:latest`;
        else this.answers.dockerTag = `${this.answers.dockerUserName}/${repoName}`;
        await this.prompts(['redux', 'dockerTag']);
    }

    end() {
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
