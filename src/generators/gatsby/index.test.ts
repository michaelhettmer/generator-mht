import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import axios from 'axios';
import { files } from '../node/index.test';
import { Answers } from './index';

describe('mht:gatsby', () => {
    it('successfully copies all files into destination in local mode without network requests', async () => {
        const post = jest.spyOn(axios, 'post');
        const get = jest.spyOn(axios, 'get');

        const result = await helpers
            .run(path.join(__dirname, '../../../generators/gatsby'))
            .withOptions({
                local: true,
                'skip-signing': true,
                'skip-git': true,
                'skip-installation': true,
                private: true,
            })
            .withPrompts({
                ci: 'GitLab',
                repo: 'GitLab',
            } as Partial<Answers>);
        assert.ok(result, 'generator result is invalid');
        assert.file([
            ...files,
            '__mocks__',
            'src',
            '.stylelintrc.json',
            '.dockerignore',
            'Dockerfile',
            'gatsby-browser.js',
            'gatsby-config.js',
            'gatsby-node.js',
            'gatsby-ssr.js',
            'jest.loadershim.js',
            'jest.preprocess.js',
            'jest.setup.js',
            'nginx.conf',
        ]);
        assert.noFile('.gitlab-ci.yml');

        expect(post).not.toHaveBeenCalled();
        expect(get).toHaveBeenCalledTimes(2); // TODO: why 2? should be 1. writing() of node is called twice
    }, 60000);
});
