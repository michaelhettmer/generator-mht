import path from 'path';
import fs from 'fs-extra';
import uuid from 'uuid/v4';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import Generator from './index';

const setupTestDir = async () => {
    const dir = `/tmp/${uuid()}`;
    const testDir = `${dir}/docker`;
    const templatePath = path.resolve('src/generators/docker/templates');
    const destinationPath = `${testDir}/templates`;
    console.log({ testDir });
    console.log({ templatePath });
    console.log({ destinationPath });
    await fs.copy(path.resolve('src/generators/app'), `${dir}/app`);
    return [testDir, templatePath, destinationPath];
};

describe('mht:docker', () => {
    it('successfully copies all files into destination', async () => {
        const [testDir, templatePath, destinationPath] = await setupTestDir();
        const result = await helpers
            .run(Generator)
            .inDir(testDir, async () => {
                await fs.copy(templatePath, destinationPath);
            })
            .withOptions({ '--local': '' })
            .withPrompts({ generator: 'latex' });
        assert.ok(result, 'result is valid');
        assert.file([
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
    }, 60000);
});
