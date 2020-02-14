import fs from 'fs-extra';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import mockAxios from 'jest-mock-axios';
import { setupTestDir } from '../app/testUtils';
import Generator, { Answers } from './index';

afterEach(() => {
    mockAxios.reset();
});

describe('mht:docker', () => {
    it('successfully copies all files into destination in local mode without network requests', async () => {
        const [testDir, templatePath, destinationPath] = await setupTestDir('latex');
        const result = await helpers
            .run(Generator)
            .inDir(testDir, async () => {
                await fs.copy(templatePath, destinationPath);
            })
            .withOptions({ local: '' })
            .withPrompts({
                ci: 'GitLab',
                repo: 'GitLab',
            } as Partial<Answers>);
        assert.ok(result, 'generator result is invalid');
        assert.file([
            '.all-contributorsrc',
            '.gitattributes',
            'CONTRIBUTING.md',
            'CODE_OF_CONDUCT.md',
            'LICENSE',
            'README.md',
            '.devcontainer',
            '.vscode',
            '.gitlab-ci.yml',
        ]);

        expect(mockAxios.get).not.toHaveBeenCalled();
        expect(mockAxios.post).not.toHaveBeenCalled();
    }, 60000);
});
