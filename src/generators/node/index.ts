import startCase = require('lodash.startcase');
import kebabCase = require('lodash.kebabcase');
import BaseGenerator, { CommonAnswers } from '../app/base';

export interface Answers extends CommonAnswers {
    isLib: boolean;
}

export default class extends BaseGenerator<Answers> {
    constructor(args: string | string[], opts: {}) {
        super(args, opts);
        this.answers.isLib = false;
    }

    async prompting() {
        this.printOptions();

        if (this.options.oss) {
            this.answers.repo = 'GitHub';
            this.answers.ci = 'CircleCI';
        } else if (this.options.private) {
            // default config is already correct
        } else {
            await this.prompts(['ci', 'repo', 'repoUserName', 'repoName']);
            this.answers.authorName = startCase(this.answers.repoUserName); // reuse repoUserName
            this.answers.moduleName = kebabCase(this.answers.repoName.replace(/\s/g, '-')).toLowerCase(); // reuse repoName
            await this.prompts(['authorName', 'moduleName', 'description', 'isLib']);
            if (this.answers.isLib) await this.prompts(['devDep']);
            else this.answers.devDep = false;
            await this.prompts(['vscode']);
        }
    }

    async writing() {
        const gitignore = await this.fetchGitIgnore('node');
        gitignore && this.fs.write(this.destinationPath('.gitignore'), gitignore);

        this.cps('.all-contributorsrc');
        this.cps('.commitlintrc.js');
        this.cps('.gitattributes');
        this.cps('CONTRIBUTING.md');
        this.cps('.huskyrc.js');
        this.cps('.npmrc');
        this.cps('CODE_OF_CONDUCT.md');
        this.cps('LICENSE');
        this.cps('README.md');
        this.cp('lint-staged.config.js');
        this.cp('_.eslintignore', '.eslintignore');
        this.cp('_.eslintrc.js', '.eslintrc.js');
        this.cp('_.prettierignore', '.prettierignore');
        this.cp('_.prettierrc.js', '.prettierrc.js');
        this.cp('.releaserc');
        this.exs('_package.json', 'package.json');

        if (this.answers.vscode) this.cps('.vscode');

        if (this.answers.ci === 'GitLab') this.cp('.gitlab-ci.yml');
        else if (this.answers.ci === 'CircleCI') this.cp('.circleci');

        if (this.answers.repo === 'GitHub') {
            this.cps('.github');
            this.exs('.github/renovate.json');
        }
    }

    async install() {
        this.initGitSync();
        this.npmInstallSync();
        this.initialCommitSync();

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
