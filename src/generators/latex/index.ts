import Generator from 'yeoman-generator';

const CIProviders = ['circleci', 'gitlab'] as const;
type CIProvider = typeof CIProviders[number];

interface Answers extends Generator.Answers {
    vscode?: boolean;
    ci?: CIProvider;
}

export default class extends Generator {
    public answers: Answers = {};

    constructor(args: string | string[], opts: {}) {
        super(args, opts);
    }

    async prompting() {
        this.answers = await this.prompt<Answers>([
            {
                name: 'vscode',
                message: 'Do you use VSCode?',
                default: true,
                type: 'confirm',
                store: true,
            },
            {
                name: 'ci',
                message: 'Do you want to use a CI provider?',
                default: true,
                type: 'list',
                choices: CIProviders,
                store: true,
            },
        ]);
    }

    writing() {
        const cp = (from: string, to: string = from, context: { [key: string]: string } = {}) =>
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
