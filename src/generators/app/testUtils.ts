import path from 'path';
import fs from 'fs-extra';
import uuid from 'uuid/v4';

export const setupTestDir = async (name: string) => {
    const dir = `/tmp/${uuid()}`;
    const testDir = `${dir}/${name}`;
    const templatePath = path.resolve(`src/generators/${name}/templates`);
    const destinationPath = `${testDir}/templates`;
    console.log({ testDir });
    console.log({ templatePath });
    console.log({ destinationPath });
    await fs.copy(path.resolve('src/generators/app'), `${dir}/app`);
    return [testDir, templatePath, destinationPath];
};
