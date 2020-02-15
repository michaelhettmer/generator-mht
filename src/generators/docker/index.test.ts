import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import axios from 'axios';
import { Answers } from './index';

describe('mht:docker', () => {
    it('successfully copies all files into destination in local mode without network requests', async () => {
        const post = jest.spyOn(axios, 'post');
        const get = jest.spyOn(axios, 'get');

        const result = await helpers
            .run(path.join(__dirname, '../../../generators/docker'))
            .withOptions({ local: true, sign: false })
            .withPrompts({
                ci: 'CircleCI',
                repo: 'GitHub',
            } as Partial<Answers>);
        assert.ok(result, 'generator result is invalid');
        assert.file([
            '.circleci',
            '.vscode',
            '.all-contributorsrc',
            '.dockerignore',
            '.gitattributes',
            'CONTRIBUTING.md',
            'CODE_OF_CONDUCT.md',
            'LICENSE',
            'README.md',
            '.npmrc',
            '.releaserc',
            'Dockerfile',
            'package.json',
        ]);
        assert.noFile(['.gitlab-ci.yml']);

        expect(post).not.toHaveBeenCalled();
        expect(get).toHaveBeenCalledTimes(1);
    }, 60000);
});
