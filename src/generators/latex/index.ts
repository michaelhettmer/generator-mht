import Generator from 'yeoman-generator';

export default class extends Generator {
    async prompting() {
        return this.prompt([
            {
                name: 'vscode',
                message: 'Do you use VSCode?',
                default: true,
                type: 'confirm',
                store: true,
            },
            {
                name: 'vscodeContainer',
                message: 'Do you need a devcontainer environment for VSCode?',
                default: true,
                type: 'confirm',
                when: ({ vscode }) => vscode,
                store: true,
            },
        ]);
    }

    writing() {
        const cp = (from: string, to: string = from, context: { [key: string]: string } = {}) =>
            this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context);

        cp('.devcontainer');
        cp('.vscode');
        cp('.gitignore');
        cp('.gitlab-ci.yml');
    }

    installing() {
        this.spawnCommand('git', ['init']);
    }
}
