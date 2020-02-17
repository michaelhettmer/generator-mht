import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import axios from 'axios';
import { Answers } from './index';

describe('mht:latex', () => {
    it('successfully copies all files into destination in local mode without network requests', async () => {
        const post = jest.spyOn(axios, 'post');
        const get = jest.spyOn(axios, 'get');

        const result = await helpers
            .run(path.join(__dirname, '../../../generators/latex'))
            .withOptions({ local: true, 'skip-signing': true, 'skip-installation': true })
            .withPrompts({
                ci: 'GitLab',
                repo: 'GitLab',
            } as Partial<Answers>);
        assert.ok(result, 'generator result is invalid');
        assert.file([
            '.all-contributorsrc',
            '.commitlintrc.js',
            '.gitattributes',
            'CONTRIBUTING.md',
            'CODE_OF_CONDUCT.md',
            'LICENSE',
            'lint-staged.config.js',
            'README.md',
            '.gitignore',
            '.devcontainer',
            '.vscode',
            '.gitlab-ci.yml',
            '.gitignore',
            'package.json',
        ]);
        assert.noFile('.github');

        expect(post).not.toHaveBeenCalled();
        expect(get).not.toHaveBeenCalled();
    }, 60000);
});
