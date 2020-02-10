import Generator from 'yeoman-generator';
import yeoman, { GeneratorMeta } from 'yeoman-environment';

const env = yeoman.createEnv();

export default class extends Generator {
    async prompting() {
        const lookupAsync = () => {
            return new Promise<{ [namespace: string]: GeneratorMeta }>((resolve, reject) => {
                env.lookup(err => {
                    if (err) return reject(err);
                    resolve(env.getGeneratorsMeta());
                });
            });
        };
        const generatorsMeta = await lookupAsync();
        const generators = Object.keys(generatorsMeta)
            .filter(g => g.startsWith('mht:') && !g.endsWith('app'))
            .map(g => g.slice(4));

        const answers = await this.prompt([
            {
                name: 'generator',
                message: 'Which generator do you want to start?',
                type: 'list',
                choices: generators,
            },
        ]);

        process.env.NODE_ENV !== 'test' &&
            env.run(`mht:${answers.generator}`, (err: null | Error) => console.log('done', err ?? 'without an error'));
    }
}
