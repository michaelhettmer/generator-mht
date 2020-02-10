import Generator from 'yeoman-generator';

const CIProviders = ['gitlab', 'circleci', 'no'] as const;
type CIProvider = typeof CIProviders[number];

interface Answers extends Generator.Answers {
    document: string;
    outDirectory: string;
    vscode: boolean;
    ci: CIProvider;
}

export default class extends Generator {
    public answers: Answers = {
        document: 'document',
        outDirectory: 'out',
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
                    name: 'document',
                    message: 'What should the name of the initial document be?',
                    default: this.answers.document,
                    type: 'input',
                    store: true,
                },
                {
                    name: 'outDirectory',
                    message: 'Which directory should be used for generated files?',
                    default: this.answers.outDirectory,
                    type: 'input',
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
            document: this.answers.document,
            outDirectory: this.answers.outDirectory,
        };
        const cp = (from: string, to: string = from) =>
            this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context);

        if (this.answers.vscode) {
            cp('.devcontainer');
            cp('.vscode');
        }

        if (this.answers.ci === 'gitlab') {
            cp('.gitignore');
            cp('.gitlab-ci.yml');
        }
    }

    installing() {
        this.spawnCommand('git', ['init']);
    }
}
