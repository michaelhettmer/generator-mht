import startCase = require('lodash.startcase');
import kebabCase = require('lodash.kebabcase');
import BaseGenerator, { CommonAnswers } from '../app/base';

export interface Answers extends CommonAnswers {
    dockerUserName: string;
}

export default class extends BaseGenerator<Answers> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(args: string | string[], opts: {}) {
        super(args, opts);
        this.answers.dockerUserName = 'michaelhettmer';
    }

    async prompting(): Promise<void> {
        this.printOptions();

        if (this.options.oss) {
            this.answers.repo = 'GitHub';
            this.answers.ci = 'CircleCI';
        } else if (this.options.private) {
            // default config is already correct
        } else {
            await this.prompts(['ci', 'repo', 'repoUserName', 'repoName']);
            this.answers.dockerUserName = this.answers.repoUserName.toLowerCase().replace(/\s/g, ''); // reuse repoUserName
            this.answers.authorName = startCase(this.answers.repoUserName); // reuse repoUserName
            this.answers.moduleName = kebabCase(
                this.answers.repoName.replace(/^docker-/, '').replace(/\s/g, '-'),
            ).toLowerCase(); // reuse repoName
            await this.prompts(['dockerUserName', 'authorName', 'moduleName', 'description', 'devDep', 'vscode']);
        }
    }

    async writing(): Promise<void> {
        const gitignore = await this.fetchGitIgnore('node');
        gitignore && this.fs.write(this.destinationPath('.gitignore'), gitignore);

        this.cps('.all-contributorsrc');
        this.cps('.commitlintrc.js');
        this.cps('.dockerignore');
        this.cps('.gitattributes');
        this.cps('.huskyrc.js');
        this.cps('CONTRIBUTING.md');
        this.cps('CODE_OF_CONDUCT.md');
        this.cps('LICENSE');
        this.cps('lint-staged.config.js');
        this.cps('README.md');
        this.cps('.npmrc');
        this.cp('.releaserc');
        this.cp('Dockerfile');
        this.exs('_package.json', 'package.json');

        if (this.answers.vscode) this.cps('.vscode');

        if (this.answers.ci === 'GitLab') this.cp('.gitlab-ci.yml');
        else if (this.answers.ci === 'CircleCI') this.cp('.circleci');

        if (this.answers.repo === 'GitHub') this.cps('.github');
    }

    async install(): Promise<void> {
        this.initGitSync();
        this.npmInstallSync();
        this.initialCommitSync();

        await this.createGitHubProjectAndPush();
        await this.followGitHubProjectWithCircleCI();
    }

    end(): void {
        if (this.answers.repo === 'GitHub') {
            this.log('make sure you configure all used bots / services manually, if it will not happen automatically');
            this.log('https://github.com/settings/installations');
        }
    }
}
