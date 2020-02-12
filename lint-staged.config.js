module.exports = {
    '*.{js,jsx,json,jsonc}': ['npm run lint:fix'],
    '**/.circleci/config.yml': ['npm run validate:circleci'],
};
