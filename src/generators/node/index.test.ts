import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import axios from 'axios';
import { Answers } from './index';

export const files = [
    '.gitignore',
    '.all-contributorsrc',
    '.commitlintrc.js',
    '.gitattributes',
    'CONTRIBUTING.md',
    '.huskyrc.js',
    '.npmrc',
    'CODE_OF_CONDUCT.md',
    'LICENSE',
    'README.md',
    '.eslintignore',
    '.eslintrc.json',
    '.prettierignore',
    '.prettierrc.json',
    'package.json',
    '.releaserc',
    'jest.config.js',
    'lint-staged.config.js',
    'tsconfig.json',
    '.vscode',
    'src/index.ts',
    'src/index.test.ts',
    '.github',
];

describe('mht:node', () => {
    it('successfully copies all files into destination in local mode without network requests', async () => {
        const post = jest.spyOn(axios, 'post');
        const get = jest.spyOn(axios, 'get');

        const result = await helpers
            .run(path.join(__dirname, '../../../generators/node'))
            .withOptions({ local: true, 'skip-signing': true, 'skip-git': true, 'skip-installation': true })
            .withPrompts({
                ci: 'CircleCI',
                repo: 'GitHub',
            } as Partial<Answers>);
        assert.ok(result, 'generator result is invalid');
        assert.file(files);
        assert.noFile('.gitlab-ci.yml');

        expect(post).not.toHaveBeenCalled();
        expect(get).toHaveBeenCalledTimes(1);
    }, 60000);
});
