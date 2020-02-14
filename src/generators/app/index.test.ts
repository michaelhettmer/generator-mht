import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import Generator from './index';

describe('mht:app', () => {
    it('successfully starts the generator and returns without an error', async () => {
        const result = await helpers.run(Generator).withPrompts({ generator: 'latex' });
        assert.ok(result, 'successfully started');
    });
});
