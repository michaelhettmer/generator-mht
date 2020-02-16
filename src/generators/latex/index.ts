import kebabCase = require('lodash.kebabcase');
import BaseGenerator, { CommonAnswers } from '../app/base';

export interface Answers extends CommonAnswers {
    document: string;
    outDirectory: string;
}

export default class extends BaseGenerator<Answers> {
    constructor(args: string | string[], opts: {}) {
        super(args, opts);
        this.answers.document = 'document';
        this.answers.outDirectory = 'out';
    }

    async prompting() {
        this.printOptions();

        if (this.options.oss) {
            this.answers.repo = 'GitHub';
            this.answers.ci = 'CircleCI';
        } else if (this.options.private) {
            // default config is already correct
        } else {
            await this.prompts([
                'ci',
                'repo',
                'repoName',
                'description',
                'repoUserName',
                'authorName',
                'vscode',
                'latexDocumentName',
                'latexOutDir',
            ]);
            this.answers.moduleName = kebabCase(this.answers.repoName.replace(/\s/g, '-')).toLowerCase(); // reuse repoName
        }
    }

    async writing() {
        this.cps('.all-contributorsrc');
        this.cps('.gitattributes');
        this.cps('CONTRIBUTING.md');
        this.cps('CODE_OF_CONDUCT.md');
        this.cps('LICENSE');
        this.cps('README.md');
        this.cp('.gitignore');

        if (this.answers.vscode) {
            this.cp('.devcontainer');
            this.exs('.vscode/settings.json');
        }

        if (this.answers.ci === 'GitLab') {
            this.cp('.gitlab-ci.yml');
        }

        if (this.answers.repo === 'GitHub') this.cps('.github');
    }

    async installing() {
        this.initGitSync();

        await this.createGitHubProjectAndPush();
        await this.followGitHubProjectWithCircleCI();
    }

    end() {
        if (this.answers.repo === 'GitHub') {
            this.log('make sure you configure all used bots / services manually, if it will not happen automatically');
            this.log('https://github.com/settings/installations');
        }
    }
}
