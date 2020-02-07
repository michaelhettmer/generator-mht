import Generator from './index';
import helpers from 'yeoman-test';

describe('mht:app', () => {
    it('successfully starts the generator and returns without an error', () => {
        return helpers
            .run(Generator)
            .withPrompts({ moduleName: 'test' })
            .then(() => console.log('finished successfully'));
    });
});
