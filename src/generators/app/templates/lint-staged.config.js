module.exports = {
    <% if (ci === 'CircleCI') { %><%- `\n'**/.circleci/config.yml': filenames => filenames.map(filename => ${`npm run lint:circleci \"\$\{filename\}\"`}),` %><% } %>
};
