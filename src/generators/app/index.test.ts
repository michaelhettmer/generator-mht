import Generator from './index';
import helpers from 'yeoman-test';

describe('mht:app', () => {
    it('successfully starts the generator and returns without an error', () => {
        return helpers
            .run(Generator)
            .withPrompts({ generator: 'latex' })
            .then(() => console.log('finished successfully'));
    });
});
