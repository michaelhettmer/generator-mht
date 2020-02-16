module.exports = {
    '*.{js,jsx,json,jsonc}': ['npm run lint:fix'],<% if (ci === 'CircleCI') { %><%- `\n'**/.circleci/config.yml': filenames => filenames.map(filename => ${`npm run lint:circleci '${filename}'`}),` %><% } %>
};
