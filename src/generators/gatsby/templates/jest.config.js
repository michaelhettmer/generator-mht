module.exports = {
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)?$': '<rootDir>/jest.preprocess.js',
    },
    moduleNameMapper: {
        '~/(.*)': '<rootDir>/src/$1',
        '.+\\.(module.css|css|styl|less|sass|scss)$': `identity-obj-proxy`,
        '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
        '.+\\.(svg)$': `<rootDir>/__mocks__/svg.js`,
    },
    testPathIgnorePatterns: [`node_modules`, `.cache`, `public`],
    transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
    globals: {
        __PATH_PREFIX__: ``,
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.([tj]sx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', 'src'],
    testURL: `http://localhost`,
    setupFiles: [`<rootDir>/jest.loadershim.js`],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
