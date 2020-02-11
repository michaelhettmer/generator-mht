import Generator from 'yeoman-generator';
import kebabCase from 'lodash.kebabcase';

const CIProviders = ['GitLab', 'CircleCI', 'no'] as const;
type CIProvider = typeof CIProviders[number];

const Repositories = ['GitLab', 'GitHub'] as const;
type Repository = typeof Repositories[number];

const RepositoryUrls: { [key in Repository]: string } = {
    GitHub: 'github.com',
    GitLab: 'gitlab.com',
};

interface Answers extends Generator.Answers {
    packageName: string;
    authorName: string;
    vscode: boolean;
    repo: Repository;
    ci: CIProvider;
}

export default class extends Generator {
    public answers: Answers = {
        packageName: kebabCase(this.appname.replace(/\s/g, '-')).toLowerCase(),
        authorName: 'MichaelHettmer',
        vscode: true,
        repo: 'GitLab',
        ci: 'GitLab',
    };

    constructor(args: string | string[], opts: {}) {
        super(args, opts);

        this.option('oss', {
            alias: 'o',
            description: 'Default configuration for an OpenSource project on GitHub with CircleCI',
        });

        this.option('private', {
            alias: 'p',
            description: 'Default configuration for a private project on GitLab with GitLabCi',
        });
    }

    async prompting() {
        if (this.options.oss) {
            this.answers.ci = 'CircleCI';
            this.answers.repo = 'GitHub';
        } else if (this.options.private) {
            // default config is already correct
        } else {
            this.answers = await this.prompt<Answers>([
                {
                    name: 'packageName',
                    message: 'What do you want to name your module?',
                    default: this.appname.replace(/\s/g, '-'),
                    filter: x => kebabCase(x).toLowerCase(),
                    store: true,
                },
                {
                    name: 'repo',
                    message: 'Select a repository provider',
                    default: this.answers.repo,
                    type: 'list',
                    choices: Repositories,
                    store: true,
                },
                {
                    name: 'authorName',
                    message: `What is your username in this repository ?`,
                    default: 'MichaelHettmer',
                    store: true,
                },
                {
                    name: 'vscode',
                    message: 'Do you use VSCode?',
                    default: this.answers.vscode,
                    type: 'confirm',
                    store: true,
                },
                {
                    name: 'ci',
                    message: 'Select a CI provider',
                    default: this.answers.ci,
                    type: 'list',
                    choices: CIProviders,
                    store: true,
                },
            ]);
        }
    }

    writing() {
        const context: { [key: string]: string } = {
            packageName: this.answers.packageName,
            authorName: this.answers.authorName,
            repositoryUrl: RepositoryUrls[this.answers.repo],
        };
        const cp = (from: string, to: string = from) =>
            this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context);

        cp('.gitignore');
        cp('.npmrc');
        cp('.releaserc');
        cp('Dockerfile');
        cp('package.json');

        if (this.answers.vscode) cp('.vscode');

        if (this.answers.ci === 'GitLab') cp('.gitlab-ci.yml');
        else if (this.answers.ci === 'CircleCI') cp('.circleci');
    }

    installing() {
        this.spawnCommand('git', ['init']);
        this.npmInstall();
    }
}
