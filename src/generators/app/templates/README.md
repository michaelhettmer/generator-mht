<div align="center">
<h1><%= moduleName %></h1>

<p><%= description %></p>
</div>

---

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Version][version-badge]][package]
[![Downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![Semantic Release][release-badge]][release]
[![Conventional Commits][commits-badge]][commits]

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors-)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
[![Discord][discord-badge]][discord]
[![Twitter][twitter-badge]][twitter]

## About

// TODO

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [⚙️ Installation](#️-installation)
- [⚡️ Getting Started](#️-getting-started)
- [🎯 Features](#-features)
- [Other Solutions](#other-solutions)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [Contributors ✨](#contributors-)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## ⚙️ Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's <% if (devDep) {
%>`devDependencies`<% } %><% if (!devDep) { %>`dependencies`<% } %>:

```
npm install --save<% if (devDep) { %>-dev<% } %> <%= moduleName %>
```

## ⚡️ Getting Started

// TODO

## 🎯 Features

// TODO

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it here!

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

## Contributors ✨

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://michael-hettmer.de"><img src="https://avatars0.githubusercontent.com/u/13876624?v=4" width="100px;" alt="Michael Hettmer"/><br /><sub><b>Michael Hettmer</b></sub></a><br /><a href="https://github.com/<%= repoUserName %>/<%= repoName %>/commits?author=<%= repoUserName %>" title="Code">💻</a> <a href="https://github.com/<%= repoUserName %>/<%= repoName %>/commits?author=<%= repoUserName %>" title="Documentation">📖</a> <a href="#infra-<%= repoUserName %>" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/<%= repoUserName %>/<%= repoName %>/commits?author=<%= repoUserName %>" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

The README.md format is heavily inspired by @kentcdodds. Thank you for your awesome work!

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[build-badge]: https://circleci.com/gh/<%= repoUserName %>/<%= repoName %>/tree/master.svg?style=shield
[build]: https://circleci.com/gh/<%= repoUserName %>/<%= repoName %>
[coverage-badge]: https://codecov.io/gh/<%= repoUserName %>/<%= repoName %>/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/<%= repoUserName %>/<%= repoName %>
[version-badge]: https://img.shields.io/npm/v/<%= moduleName %>.svg
[package]: https://www.npmjs.com/package/<%= moduleName %>
[downloads-badge]: https://img.shields.io/npm/dm/<%= moduleName %>.svg
[npmtrends]: http://www.npmtrends.com/<%= moduleName %>
[license-badge]: https://img.shields.io/npm/l/<%= moduleName %>.svg
[license]: https://github.com/<%= repoUserName %>/<%= repoName %>/blob/master/LICENSE
[release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[release]: https://github.com/semantic-release/semantic-release
[commits-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[commits]: https://conventionalcommits.org
[twitter-badge]: https://img.shields.io/twitter/follow/<%= repoUserName %>.svg?label=Follow%20@<%= repoUserName %>
[twitter]: https://twitter.com/intent/follow?screen_name=<%= repoUserName %>
[discord-badge]: https://img.shields.io/discord/620938362379042837
[discord]: https://discord.gg/MEpKcF3
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg
[coc]: https://github.com/<%= repoUserName %>/<%= repoName %>/blob/master/CODE_OF_CONDUCT.md
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[bugs]: https://github.com/<%= repoUserName %>/<%= repoName %>/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Acreated-desc+label%3Abug
[requests]: https://github.com/<%= repoUserName %>/<%= repoName %>/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement
[good-first-issue]: https://github.com/<%= repoUserName %>/<%= repoName %>/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement+label%3A%22good+first+issue%22
<!-- prettier-ignore-end -->