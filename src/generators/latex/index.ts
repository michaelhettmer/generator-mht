import Generator from 'yeoman-generator';
import path from 'path';
import rename from 'gulp-rename';

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
        this.registerTransformStream(
            rename(path => {
                // remove all underscores at the start of any filename while writing the files
                if (path.basename?.startsWith('_')) path.basename = path.basename.slice(1);
            }),
        );

        const cp = (from: string, to: string = from, context: { [key: string]: string } = {}) => {
            // add an underscore to each path segment after 'templates'
            const tSegments = this.templatePath(from).split('/');
            const tIndex = tSegments.indexOf('templates');
            const template = `/${path.join(
                ...tSegments.map((value, index) => `${index > tIndex ? '_' : ''}${value}`),
            )}`;

            this.fs.copyTpl(template, this.destinationPath(to), context);
        };

        cp('.devcontainer');
        cp('.vscode');
        cp('.gitignore');
        cp('.gitlab-ci.yml');
    }

    installing() {
        this.spawnCommand('git', ['init']);
    }
}
