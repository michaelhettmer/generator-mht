<div align="center">
<h1>MHT Generator - My Yeoman templates</h1>

<p>Battle-tested configurations and setups meet personal preference and the laziness of a programmer.</p>
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

## Demo

![Demo](docs/demo.gif)

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
should be installed as one of your project's `dependencies`:

```
npm install --save generator-mht
```

## ⚡️ Getting Started

### Running without an installation

```sh
npx -p yo -p generator-mht -c 'yo mht'
```

### Installation

```sh
npm install -g generator-mht yo
```

### Usage

```sh
yo mht
```

## 🎯 Features

All templates come with an optional fully integrated CI/CD workflow including a semantic-release managed delivery pipeline.
If possible TypeScript is always preferred above JavaScript.

### Included templates

* [ ] Expo bare application
* [ ] Expo managed application
* [ ] Gatsby plugin library
* [ ] Gatsby theme library
* [x] Docker image
* [x] Gatsby application
* [x] Latex document
* [x] Node application 
* [x] Node library

### Supported services

* [x] CircleCI
* [x] CodeCov
* [x] Docker Hub
* [x] GitHub
* [x] GitLab
* [x] GitLab CI
* [x] NPM
* [x] Renovate Bot

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
    <td align="center"><a href="https://michael-hettmer.de"><img src="https://avatars0.githubusercontent.com/u/13876624?v=4" width="100px;" alt="Michael Hettmer"/><br /><sub><b>Michael Hettmer</b></sub></a><br /><a href="https://github.com/MichaelHettmer/generator-mht/commits?author=MichaelHettmer" title="Code">💻</a> <a href="https://github.com/MichaelHettmer/generator-mht/commits?author=MichaelHettmer" title="Documentation">📖</a> <a href="#infra-MichaelHettmer" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/MichaelHettmer/generator-mht/commits?author=MichaelHettmer" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[build-badge]: https://circleci.com/gh/MichaelHettmer/generator-mht/tree/master.svg?style=shield
[build]: https://circleci.com/gh/MichaelHettmer/generator-mht
[coverage-badge]: https://codecov.io/gh/MichaelHettmer/generator-mht/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/MichaelHettmer/generator-mht
[version-badge]: https://img.shields.io/npm/v/generator-mht.svg
[package]: https://www.npmjs.com/package/generator-mht
[downloads-badge]: https://img.shields.io/npm/dm/generator-mht.svg
[npmtrends]: http://www.npmtrends.com/generator-mht
[license-badge]: https://img.shields.io/npm/l/generator-mht.svg
[license]: https://github.com/MichaelHettmer/generator-mht/blob/master/LICENSE
[release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[release]: https://github.com/semantic-release/semantic-release
[commits-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[commits]: https://conventionalcommits.org
[twitter-badge]: https://img.shields.io/twitter/follow/MichaelHettmer.svg?label=Follow%20@MichaelHettmer
[twitter]: https://twitter.com/intent/follow?screen_name=MichaelHettmer
[discord-badge]: https://img.shields.io/discord/620938362379042837
[discord]: https://discord.gg/MEpKcF3
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg
[coc]: https://github.com/MichaelHettmer/generator-mht/blob/master/CODE_OF_CONDUCT.md
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[bugs]: https://github.com/MichaelHettmer/generator-mht/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Acreated-desc+label%3Abug
[requests]: https://github.com/MichaelHettmer/generator-mht/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement
[good-first-issue]: https://github.com/MichaelHettmer/generator-mht/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement+label%3A%22good+first+issue%22
<!-- prettier-ignore-end -->