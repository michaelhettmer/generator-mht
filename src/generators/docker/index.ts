import Generator from 'yeoman-generator';

const CIProviders = ['gitlab', 'circleci', 'no'] as const;
type CIProvider = typeof CIProviders[number];

interface Answers extends Generator.Answers {
    vscode: boolean;
    ci: CIProvider;
}

export default class extends Generator {
    public answers: Answers = {
        vscode: true,
        ci: 'gitlab',
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
            this.answers.ci = 'circleci';
        } else if (this.options.private) {
            // default config is already correct
        } else {
            this.answers = await this.prompt<Answers>([
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
        const context: { [key: string]: string } = {};
        const cp = (from: string, to: string = from) =>
            this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context);

        cp('Dockerfile');
        cp('.gitignore');

        if (this.answers.vscode) {
            cp('.vscode');
        }

        if (this.answers.ci === 'gitlab') {
            cp('.gitlab-ci.yml');
        }
    }

    installing() {
        this.spawnCommand('git', ['init']);
    }
}
